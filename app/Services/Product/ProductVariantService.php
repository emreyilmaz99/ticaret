<?php

namespace App\Services\Product;

use App\Interfaces\Services\Product\ProductVariantServiceInterface;
use App\Services\BaseService;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Repositories\Interfaces\ProductVariantRepositoryInterface;
use App\Traits\ManagesVariantStock;
use App\Exceptions\InsufficientStockException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * ProductVariantService
 * 
 * Handles product variant create, update, stock, SKU management.
 */
class ProductVariantService extends BaseService implements ProductVariantServiceInterface
{
    use ManagesVariantStock;

    // Stock limits
    private const MAX_STOCK_AMOUNT = 999999;
    private const MIN_STOCK_AMOUNT = 0;

    // Cache TTL
    private const VARIANTS_CACHE_TTL = 3600; // 1 hour

    protected ProductVariantRepositoryInterface $variantRepo;

    public function __construct(ProductVariantRepositoryInterface $variantRepo)
    {
        $this->variantRepo = $variantRepo;
    }

    /**
     * Create variant for product
     */
    public function createVariant(int $productId, array $data): ProductVariant
    {
        $data['product_id'] = $productId;

        // Generate SKU if not provided
        if (empty($data['sku'])) {
            $product = Product::find($productId);
            $data['sku'] = $this->generateSKU($product->slug, $data['attributes'] ?? null);
        }

        $variant = $this->variantRepo->create($data);

        // Clear variants cache
        Cache::forget($this->getVariantsCacheKey($productId));

        Log::info('Variant created', ['variant_id' => $variant->id, 'product_id' => $productId]);

        return $variant;
    }

    /**
     * Update variant
     */
    public function updateVariant(int $variantId, array $data): ProductVariant
    {
        $variant = $this->variantRepo->update($variantId, $data);

        // Clear variants cache
        Cache::forget($this->getVariantsCacheKey($variant->product_id));

        Log::info('Variant updated', ['variant_id' => $variantId]);

        return $variant;
    }

    /**
     * Delete variant
     */
    public function deleteVariant(int $variantId): bool
    {
        $variant = $this->variantRepo->findById($variantId);
        
        if (!$variant) {
            return false;
        }

        $productId = $variant->product_id;
        $result = $this->variantRepo->delete($variantId);

        if ($result) {
            // Clear variants cache
            Cache::forget($this->getVariantsCacheKey($productId));
            Log::info('Variant deleted', ['variant_id' => $variantId, 'product_id' => $productId]);
        }

        return $result;
    }

    /**
     * Get product variants
     */
    public function getProductVariants(int $productId)
    {
        return Cache::remember(
            $this->getVariantsCacheKey($productId),
            self::VARIANTS_CACHE_TTL,
            fn() => $this->variantRepo->listByProduct($productId)
        );
    }

    /**
     * Get variant by ID
     */
    public function getVariant(int $variantId): ?ProductVariant
    {
        return $this->variantRepo->findById($variantId);
    }

    /**
     * Check stock availability
     */
    public function checkStock(int $variantId, int $quantity): bool
    {
        try {
            $variant = $this->validateVariant($variantId);
            return $variant->stock >= $quantity;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Update stock
     */
    public function updateStock(int $variantId, int $stock): ProductVariant
    {
        $this->validateStockAmount($stock, self::MAX_STOCK_AMOUNT);
        
        $variant = $this->variantRepo->update($variantId, ['stock' => $stock]);

        // Clear variants cache
        Cache::forget($this->getVariantsCacheKey($variant->product_id));

        Log::info('Stock updated', ['variant_id' => $variantId, 'new_stock' => $stock]);

        return $variant;
    }

    /**
     * Increment stock
     */
    public function incrementStock(int $variantId, int $amount): ProductVariant
    {
        return $this->updateStockOperation($variantId, $amount, 'increment');
    }

    /**
     * Decrement stock
     */
    public function decrementStock(int $variantId, int $amount): ProductVariant
    {
        return $this->updateStockOperation($variantId, $amount, 'decrement');
    }

    // ==================== Helper Methods ====================

    /**
     * Delete variants that are not in the keep list
     */
    protected function deleteRemovedVariants($existing, array $keepIds): int
    {
        $deletedCount = 0;
        foreach ($existing as $variant) {
            if (!in_array($variant->id, $keepIds)) {
                $this->variantRepo->delete($variant->id);
                $deletedCount++;
            }
        }
        return $deletedCount;
    }

    /**
     * Process variant updates and creations
     */
    protected function processVariantUpdates(int $productId, array $variants): array
    {
        $createdCount = 0;
        $updatedCount = 0;
        
        foreach ($variants as $variantData) {
            if (isset($variantData['id'])) {
                // Update existing
                $this->variantRepo->update($variantData['id'], $variantData);
                $updatedCount++;
            } else {
                // Create new
                $this->createVariant($productId, $variantData);
                $createdCount++;
            }
        }
        
        return ['created' => $createdCount, 'updated' => $updatedCount];
    }

    /**
     * Update stock with operation (increment/decrement)
     */
    protected function updateStockOperation(int $variantId, int $amount, string $operation): ProductVariant
    {
        $this->validateStockAmount($amount, self::MAX_STOCK_AMOUNT);
        $variant = $this->validateVariant($variantId);
        
        // Decrement-specific validation
        if ($operation === 'decrement') {
            $this->validateSufficientStock($variant, $amount);
        }
        
        $newStock = $this->calculateNewStock($variant->stock, $amount, $operation);
        
        // Increment-specific validation
        if ($operation === 'increment') {
            $this->validateStockAmount($newStock, self::MAX_STOCK_AMOUNT);
        }

        $updatedVariant = $this->variantRepo->update($variantId, ['stock' => $newStock]);

        // Clear variants cache
        Cache::forget($this->getVariantsCacheKey($variant->product_id));

        Log::info('Stock ' . $operation . 'ed', [
            'variant_id' => $variantId,
            'amount' => $amount,
            'old_stock' => $variant->stock,
            'new_stock' => $newStock
        ]);

        return $updatedVariant;
    }

    /**
     * Sync variants for product (bulk update/create/delete)
     */
    public function syncVariants(int $productId, array $variants): void
    {
        try {
            DB::transaction(function () use ($productId, $variants) {
                $keepIds = collect($variants)->pluck('id')->filter()->toArray();
                
                // Delete variants not in the list
                $existing = $this->variantRepo->listByProduct($productId);
                $deletedCount = $this->deleteRemovedVariants($existing, $keepIds);

                // Process updates and creations
                $stats = $this->processVariantUpdates($productId, $variants);

                // Clear variants cache
                Cache::forget($this->getVariantsCacheKey($productId));

                Log::info('Variants synced', [
                    'product_id' => $productId,
                    'created' => $stats['created'],
                    'updated' => $stats['updated'],
                    'deleted' => $deletedCount
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Failed to sync variants', [
                'product_id' => $productId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
