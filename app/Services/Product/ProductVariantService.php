<?php

namespace App\Services\Product;

use App\Services\BaseService;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Repositories\Interfaces\ProductVariantRepositoryInterface;

/**
 * ProductVariantService
 * 
 * Handles product variant create, update, stock, SKU management.
 */
class ProductVariantService extends BaseService
{
    protected ProductVariantRepositoryInterface $variantRepo;

    public function __construct(ProductVariantRepositoryInterface $variantRepo)
    {
        $this->variantRepo = $variantRepo;
    }

    /**
     * Create variant for product
     */
    public function createVariant(int $productId, array $data)
    {
        $data['product_id'] = $productId;

        // Generate SKU if not provided
        if (empty($data['sku'])) {
            $product = Product::find($productId);
            $data['sku'] = $product->slug . '-' . uniqid();
        }

        return $this->variantRepo->create($data);
    }

    /**
     * Update variant
     */
    public function updateVariant(int $variantId, array $data)
    {
        return $this->variantRepo->update($variantId, $data);
    }

    /**
     * Delete variant
     */
    public function deleteVariant(int $variantId): bool
    {
        return $this->variantRepo->delete($variantId);
    }

    /**
     * Get product variants
     */
    public function getProductVariants(int $productId)
    {
        return $this->variantRepo->listByProduct($productId);
    }

    /**
     * Get variant by ID
     */
    public function getVariant(int $variantId)
    {
        return $this->variantRepo->findById($variantId);
    }

    /**
     * Check stock availability
     */
    public function checkStock(int $variantId, int $quantity): bool
    {
        $variant = $this->variantRepo->findById($variantId);
        
        if (!$variant) {
            return false;
        }

        return $variant->stock >= $quantity;
    }

    /**
     * Update stock
     */
    public function updateStock(int $variantId, int $stock)
    {
        return $this->variantRepo->update($variantId, ['stock' => $stock]);
    }

    /**
     * Increment stock
     */
    public function incrementStock(int $variantId, int $amount)
    {
        $variant = $this->variantRepo->findById($variantId);
        
        if (!$variant) {
            throw new \Exception('Variant not found');
        }

        return $this->variantRepo->update($variantId, [
            'stock' => $variant->stock + $amount
        ]);
    }

    /**
     * Decrement stock
     */
    public function decrementStock(int $variantId, int $amount)
    {
        $variant = $this->variantRepo->findById($variantId);
        
        if (!$variant) {
            throw new \Exception('Variant not found');
        }

        if ($variant->stock < $amount) {
            throw new \Exception('Insufficient stock');
        }

        return $this->variantRepo->update($variantId, [
            'stock' => $variant->stock - $amount
        ]);
    }

    /**
     * Sync variants for product (bulk update/create/delete)
     */
    public function syncVariants(int $productId, array $variants): void
    {
        $keepIds = collect($variants)->pluck('id')->filter()->toArray();
        
        // Delete variants not in the list
        $existing = $this->variantRepo->listByProduct($productId);
        foreach ($existing as $variant) {
            if (!in_array($variant->id, $keepIds)) {
                $this->variantRepo->delete($variant->id);
            }
        }

        foreach ($variants as $variantData) {
            if (isset($variantData['id'])) {
                // Update existing
                $this->variantRepo->update($variantData['id'], $variantData);
            } else {
                // Create new
                $this->createVariant($productId, $variantData);
            }
        }
    }
}
