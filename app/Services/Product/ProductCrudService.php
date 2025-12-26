<?php

namespace App\Services\Product;

use App\Interfaces\Services\Product\ProductCrudServiceInterface;
use App\Services\BaseService;
use App\Models\Product;
use App\Models\Vendor;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\ProductVariantRepositoryInterface;
use App\Repositories\Interfaces\TagRepositoryInterface;
use Illuminate\Support\Str;

/**
 * ProductCrudService
 * 
 * Handles product create, update, delete operations.
 * Used by vendor controllers and admin controllers.
 */
class ProductCrudService extends BaseService implements ProductCrudServiceInterface
{
    public function __construct(
        protected ProductRepositoryInterface $repo,
        protected ProductVariantRepositoryInterface $variantRepo,
        protected TagRepositoryInterface $tagRepo
    ) {}

    /**
     * Create product for vendor
     */
    public function createForVendor(Vendor $vendor, array $data): Product
    {
        $data['vendor_id'] = $vendor->id;
        $data['status'] = $data['status'] ?? 'pending';

        // Sanitize category_id
        if (array_key_exists('category_id', $data)) {
            if ($data['category_id'] === '' || $data['category_id'] === null) {
                $data['category_id'] = null;
            } else {
                $data['category_id'] = (int) $data['category_id'];
            }
        }

        // Extract relations
        $tags = $data['tags'] ?? null;
        unset($data['tags']);
        $variants = $data['variants'] ?? null;
        unset($data['variants']);
        $images = $data['images'] ?? null;
        unset($data['images']);

        // Capture default variant data (legacy support)
        $defaultPrice = $data['price'] ?? null;
        $defaultStock = $data['stock'] ?? null;
        $defaultSku = $data['sku'] ?? null;
        $defaultWeight = $data['weight'] ?? null;
        $defaultLength = $data['length'] ?? null;
        $defaultWidth = $data['width'] ?? null;
        $defaultHeight = $data['height'] ?? null;
        $defaultUnitId = $data['unit_id'] ?? null;
        
        // Remove variant fields from product data
        unset($data['price'], $data['stock'], $data['weight'], $data['length'], $data['width'], $data['height'], $data['unit_id']);

        // Generate unique slug
        $baseSlug = isset($data['slug']) && $data['slug'] ? Str::slug($data['slug']) : Str::slug($data['name'] ?? 'product');
        $slug = $baseSlug;
        $suf = 1;
        while ($this->repo->existsBySlug($slug)) {
            $slug = $baseSlug . '-' . $suf;
            $suf++;
        }
        $data['slug'] = $slug;

        $product = $this->repo->create($data);

        // Attach tags
        if (!empty($tags) && is_array($tags)) {
            $tagIds = $this->resolveTagIds($tags);
            if (!empty($tagIds)) {
                $this->repo->syncTags($product->id, $tagIds);
            }
        }

        // Create default variant if legacy fields provided
        if ($defaultPrice !== null) {
            $this->variantRepo->create([
                'product_id' => $product->id,
                'title' => 'Varsayılan',
                'price' => $defaultPrice,
                'stock' => $defaultStock ?? 0,
                'sku' => $defaultSku ?? $product->slug,
                'weight' => $defaultWeight,
                'length' => $defaultLength,
                'width' => $defaultWidth,
                'height' => $defaultHeight,
                'unit_id' => $defaultUnitId,
                'is_default' => true,
            ]);
        }

        // Create variants if provided
        if (!empty($variants) && is_array($variants)) {
            foreach ($variants as $vData) {
                $vData['product_id'] = $product->id;
                $this->variantRepo->create($vData);
            }
        }

        return $this->repo->freshWithRelations($product->id);
    }

    /**
     * Update product
     */
    public function update(string $productId, array $data): Product
    {
        $product = $this->repo->findById($productId);

        if (!$product) {
            throw new \Exception('Ürün bulunamadı');
        }

        // Extract relations
        $tags = $data['tags'] ?? null;
        unset($data['tags']);
        $variants = $data['variants'] ?? null;
        unset($data['variants']);

        // Update slug if name changed
        if (isset($data['name']) && $data['name'] !== $product->name) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $suf = 1;
            while ($this->repo->existsBySlug($slug) && $slug !== $product->slug) {
                $slug = $baseSlug . '-' . $suf;
                $suf++;
            }
            $data['slug'] = $slug;
        }

        $this->repo->update($productId, $data);

        // Update tags
        if ($tags !== null && is_array($tags)) {
            $tagIds = $this->resolveTagIds($tags);
            $this->repo->syncTags($productId, $tagIds);
        }

        return $this->repo->freshWithRelations($productId);
    }

    /**
     * Delete product
     */
    public function delete(string $productId): bool
    {
        return $this->repo->delete($productId);
    }

    /**
     * Update product status
     */
    public function updateStatus(string $productId, string $status): Product
    {
        $product = $this->repo->findById($productId);

        if (!$product) {
            throw new \Exception('Ürün bulunamadı');
        }

        $this->repo->update($productId, ['status' => $status]);

        return $this->repo->freshWithRelations($productId);
    }

    /**
     * Resolve tag IDs from mixed input (IDs or names)
     */
    protected function resolveTagIds(array $tags): array
    {
        $tagIds = [];
        foreach ($tags as $t) {
            if (is_numeric($t)) {
                $tagIds[] = (int) $t;
            } else {
                $slug = Str::slug($t);
                $tag = $this->tagRepo->firstOrCreateBySlug($slug, ['name' => $t]);
                $tagIds[] = $tag->id;
            }
        }
        return $tagIds;
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(array $productIds, string $status): int
    {
        return $this->repo->bulkUpdateStatus($productIds, $status);
    }
}
