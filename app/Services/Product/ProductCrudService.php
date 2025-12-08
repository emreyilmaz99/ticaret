<?php

namespace App\Services\Product;

use App\Services\BaseService;
use App\Models\Product;
use App\Models\Vendor;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\TagRepositoryInterface;
use Illuminate\Support\Str;

/**
 * ProductCrudService
 * 
 * Handles product create, update, delete operations.
 * Used by vendor controllers and admin controllers.
 */
class ProductCrudService extends BaseService
{
    protected ProductRepositoryInterface $repo;
    protected TagRepositoryInterface $tagRepo;

    public function __construct(
        ProductRepositoryInterface $repo,
        TagRepositoryInterface $tagRepo
    ) {
        $this->repo = $repo;
        $this->tagRepo = $tagRepo;
    }

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
            if (!empty($tagIds)) {
                $product->tags()->sync($tagIds);
            }
        }

        // Create default variant if legacy fields provided
        if ($defaultPrice !== null) {
            $variantData = [
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
            ];
            $product->variants()->create($variantData);
        }

        // Create variants if provided
        if (!empty($variants) && is_array($variants)) {
            foreach ($variants as $vData) {
                $vData['product_id'] = $product->id;
                $product->variants()->create($vData);
            }
        }

        return $product->fresh(['variants', 'tags', 'photos']);
    }

    /**
     * Update product
     */
    public function update(int $productId, array $data): Product
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
            $product->tags()->sync($tagIds);
        }

        return $product->fresh(['variants', 'tags', 'photos']);
    }

    /**
     * Delete product
     */
    public function delete(int $productId): bool
    {
        return $this->repo->delete($productId);
    }

    /**
     * Update product status
     */
    public function updateStatus(int $productId, string $status): Product
    {
        $product = $this->repo->findById($productId);

        if (!$product) {
            throw new \Exception('Ürün bulunamadı');
        }

        $this->repo->update($productId, ['status' => $status]);

        return $product->fresh();
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(array $productIds, string $status): int
    {
        return Product::whereIn('id', $productIds)->update(['status' => $status]);
    }
}
