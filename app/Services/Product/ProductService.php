<?php

namespace App\Services\Product;

use App\Services\BaseService;
use App\Models\Product;
use App\Models\Vendor;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\TagRepositoryInterface;
use App\Repositories\Interfaces\ProductVariantRepositoryInterface;
use App\Repositories\Interfaces\ProductPhotoRepositoryInterface;
use App\Repositories\Interfaces\ProductSettingRepositoryInterface;
use App\Repositories\Interfaces\ProductMetadataRepositoryInterface;
use App\Repositories\Interfaces\ProductVariantMetadataRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductService extends BaseService
{
    protected ProductRepositoryInterface $repo;
    protected TagRepositoryInterface $tagRepo;
    protected ProductVariantRepositoryInterface $variantRepo;
    protected ProductPhotoRepositoryInterface $photoRepo;
    protected ProductSettingRepositoryInterface $settingRepo;
    protected ProductMetadataRepositoryInterface $metadataRepo;
    protected ProductVariantMetadataRepositoryInterface $variantMetadataRepo;

    public function __construct(
        ProductRepositoryInterface $repo,
        TagRepositoryInterface $tagRepo,
        ProductVariantRepositoryInterface $variantRepo,
        ProductPhotoRepositoryInterface $photoRepo,
        ProductSettingRepositoryInterface $settingRepo,
        ProductMetadataRepositoryInterface $metadataRepo,
        ProductVariantMetadataRepositoryInterface $variantMetadataRepo
    ) {
        $this->repo = $repo;
        $this->tagRepo = $tagRepo;
        $this->variantRepo = $variantRepo;
        $this->photoRepo = $photoRepo;
        $this->settingRepo = $settingRepo;
        $this->metadataRepo = $metadataRepo;
        $this->variantMetadataRepo = $variantMetadataRepo;
    }

    public function createForVendor(Vendor $vendor, array $data): Product
    {
        // ensure vendor ownership
        $data['vendor_id'] = $vendor->id;
        // vendor-created products default to pending
        $data['status'] = $data['status'] ?? 'pending';

        // sanitize category_id: convert empty string to null
        if (array_key_exists('category_id', $data)) {
            if ($data['category_id'] === '' || $data['category_id'] === null) {
                $data['category_id'] = null;
            } else {
                $data['category_id'] = (int) $data['category_id'];
            }
        }

        // extract relations
        $tags = $data['tags'] ?? null;
        unset($data['tags']);
        $variants = $data['variants'] ?? null;
        unset($data['variants']);
        $images = $data['images'] ?? null;
        unset($data['images']);

        // capture default variant data (for simple products)
        // These fields no longer exist in products table, but may come from request
        $defaultPrice = $data['price'] ?? null;
        $defaultStock = $data['stock'] ?? null;
        $defaultSku = $data['sku'] ?? null;
        $defaultWeight = $data['weight'] ?? null;
        $defaultLength = $data['length'] ?? null;
        $defaultWidth = $data['width'] ?? null;
        $defaultHeight = $data['height'] ?? null;
        $defaultUnitId = $data['unit_id'] ?? null;
        
        // Remove variant-specific fields from product data (they belong in variants table)
        unset($data['price'], $data['stock'], $data['weight'], $data['length'], $data['width'], $data['height'], $data['unit_id']);

        // create product
        // ensure slug exists and is unique
        $baseSlug = isset($data['slug']) && $data['slug'] ? Str::slug($data['slug']) : Str::slug($data['name'] ?? 'product');
        $slug = $baseSlug;
        $suf = 1;
        while ($this->repo->existsBySlug($slug)) {
            $slug = $baseSlug . '-' . $suf;
            $suf++;
        }
        $data['slug'] = $slug;

        $product = $this->repo->create($data);

        // attach tags (accept array of ids or names)
        if (! empty($tags) && is_array($tags)) {
            $tagIds = [];
            foreach ($tags as $t) {
                if (is_numeric($t)) {
                    $tag = $this->tagRepo->findById($t);
                    if ($tag) $tagIds[] = $tag->id;
                    continue;
                }
                $name = (string) $t;
                $slug = Str::slug($name);
                $tag = $this->tagRepo->firstOrCreateBySlug($slug, ['name' => $name]);
                $tagIds[] = $tag->id;
            }
            if (! empty($tagIds)) {
                $product->tags()->sync($tagIds);
            }
        }

        // create variants
        if (! empty($variants) && is_array($variants)) {
            foreach ($variants as $v) {
                $vData = array_filter([
                    'sku' => $v['sku'] ?? null,
                    'title' => $v['title'] ?? null,
                    'unit_id' => $v['unit_id'] ?? null,
                    'price' => $v['price'] ?? null,
                    'stock' => isset($v['stock']) ? (int)$v['stock'] : 0,
                    'weight' => $v['weight'] ?? null,
                    'length' => $v['length'] ?? null,
                    'width' => $v['width'] ?? null,
                    'height' => $v['height'] ?? null,
                    'metadata' => $v['metadata'] ?? null,
                ], function ($val) { return $val !== null; });
                $vData['product_id'] = $product->id;
                $this->variantRepo->create($vData);
            }
        }

        // If no variants were provided and this is a simple product, create a default variant
        if ((empty($variants) || !is_array($variants)) && ($data['type'] ?? 'simple') === 'simple') {
            $vData = [
                'product_id' => $product->id,
                'sku' => $defaultSku ?? $product->sku,
                'title' => 'Default',
                'price' => $defaultPrice,
                'stock' => isset($defaultStock) ? (int)$defaultStock : 0,
                'weight' => $defaultWeight,
                'length' => $defaultLength,
                'width' => $defaultWidth,
                'height' => $defaultHeight,
                'unit_id' => $defaultUnitId,
            ];
            // remove null values to let DB defaults apply
            $vData = array_filter($vData, function ($val) { return $val !== null; });
            $this->variantRepo->create($vData);
        }

        // store images and create media records
        if (! empty($images) && is_array($images)) {
            foreach ($images as $file) {
                if (! $file) continue;
                $path = $file->store('products', 'public');
                $url = Storage::url($path);
                // persist into product_photos table
                $this->photoRepo->create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'url' => $url,
                    'alt' => $product->name ?? null,
                ]);
            }
        }

        return $product->refresh();
    }

    public function updateForVendor(Vendor $vendor, Product $product, array $data): Product
    {
        // Verify ownership
        if ($product->vendor_id !== $vendor->id) {
            throw new \Exception('Unauthorized: Product does not belong to this vendor');
        }
        
        // prevent changing vendor_id
        unset($data['vendor_id']);

        // Handle images if present in update
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $file) {
                if (! $file) continue;
                $path = $file->store('products', 'public');
                $url = Storage::url($path);
                // persist into product_photos table
                $this->photoRepo->create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'url' => $url,
                    'alt' => $product->name ?? null,
                ]);
            }
            // Remove images from data to prevent repository from trying to update it as a column
            unset($data['images']);
        }

        // Handle Tags
        if (isset($data['tags'])) {
            $tags = $data['tags'];
            if (is_string($tags)) {
                $tags = explode(',', $tags);
            }
            if (is_array($tags)) {
                $tagIds = [];
                foreach ($tags as $t) {
                    $t = trim($t);
                    if (! $t) continue;
                    if (is_numeric($t)) {
                        $tag = $this->tagRepo->findById($t);
                        if ($tag) $tagIds[] = $tag->id;
                        continue;
                    }
                    $name = (string) $t;
                    $slug = Str::slug($name);
                    $tag = $this->tagRepo->firstOrCreateBySlug($slug, ['name' => $name]);
                    $tagIds[] = $tag->id;
                }
                $product->tags()->sync($tagIds);
            }
            unset($data['tags']);
        }

        // Handle Simple Product Price/Stock/SKU/Unit updates (stored in variants)
        if ($product->type === 'simple') {
            $variantData = [];
            if (isset($data['price'])) $variantData['price'] = $data['price'];
            if (isset($data['stock'])) $variantData['stock'] = (int)$data['stock'];
            if (isset($data['sku'])) $variantData['sku'] = $data['sku'];
            if (isset($data['unit_id'])) $variantData['unit_id'] = $data['unit_id'];

            if (!empty($variantData)) {
                $variant = $product->variants()->first();
                if ($variant) {
                    $this->variantRepo->update($variant->id, $variantData);
                } else {
                    // Create default variant if missing
                    $variantData['product_id'] = $product->id;
                    $variantData['title'] = 'Default';
                    $this->variantRepo->create($variantData);
                }
            }
            // Remove these from data as they are not in products table
            unset($data['price'], $data['stock'], $data['unit_id']);
        }

        // Handle Variable Product Variants
        if (isset($data['variants']) && is_array($data['variants'])) {
            foreach ($data['variants'] as $v) {
                $vData = array_filter([
                    'sku' => $v['sku'] ?? null,
                    'title' => $v['title'] ?? null,
                    'unit_id' => $v['unit_id'] ?? null,
                    'price' => $v['price'] ?? null,
                    'stock' => isset($v['stock']) ? (int)$v['stock'] : null,
                ], function ($val) { return $val !== null; });

                if (isset($v['id'])) {
                    // Update existing variant
                    // Verify it belongs to product
                    $existing = $this->variantRepo->findById($v['id']);
                    if ($existing && $existing->product_id == $product->id) {
                        $this->variantRepo->update($existing->id, $vData);
                    }
                } else {
                    // Create new variant
                    $vData['product_id'] = $product->id;
                    $this->variantRepo->create($vData);
                }
            }
            unset($data['variants']);
        }

        // update via repository (id-based repository interface)
        $updated = $this->repo->update($product->id, $data);
        return is_object($updated) ? $updated->refresh() : $this->repo->findById($product->id);
    }

    public function listForVendor(Vendor $vendor, int $perPage = 15)
    {
        return $this->repo->listForVendor($vendor->id, $perPage);
    }

    public function deleteForVendor(Vendor $vendor, Product $product): void
    {
        // Verify ownership
        if ($product->vendor_id !== $vendor->id) {
            throw new \Exception('Unauthorized: Product does not belong to this vendor');
        }
        
        // repository uses id-based delete signature
        $this->repo->delete($product->id);
    }

    public function deletePhotoForVendor(Vendor $vendor, Product $product, int $photoId): void
    {
        // Verify ownership
        if ($product->vendor_id !== $vendor->id) {
            throw new \Exception('Unauthorized: Product does not belong to this vendor');
        }

        // Verify photo belongs to product (optional but recommended)
        // For now, we assume the photo ID is valid and just try to delete it via repo
        // Ideally, we should check if the photo is actually linked to this product
        
        $this->photoRepo->delete($photoId);
    }

    public function findForVendor(Vendor $vendor, $productId): ?Product
    {
        return $this->repo->findForVendor($vendor->id, $productId);
    }

    // ==================== Product Settings ====================

    /**
     * Set product setting (with auto type detection)
     */
    public function setSetting(string $productId, string $key, $value)
    {
        return $this->settingRepo->upsert($productId, $key, $value);
    }

    /**
     * Get product setting with typed value
     */
    public function getSetting(string $productId, string $key, $default = null)
    {
        $setting = $this->settingRepo->findByProductAndKey($productId, $key);
        return $setting ? $setting->getTypedValueAttribute() : $default;
    }

    /**
     * Get all settings for product as key-value array
     */
    public function getAllSettings(string $productId): array
    {
        $settings = $this->settingRepo->listByProduct($productId);
        $result = [];
        
        foreach ($settings as $setting) {
            $result[$setting->setting_key] = $setting->getTypedValueAttribute();
        }
        
        return $result;
    }

    /**
     * Delete product setting
     */
    public function deleteSetting(string $productId, string $key): bool
    {
        return $this->settingRepo->deleteByProductAndKey($productId, $key);
    }

    // ==================== Product Metadata ====================

    /**
     * Set product metadata
     */
    public function setMetadata(string $productId, string $key, string $value)
    {
        return $this->metadataRepo->upsert($productId, $key, $value);
    }

    /**
     * Get product metadata
     */
    public function getMetadata(string $productId, string $key, $default = null)
    {
        $metadata = $this->metadataRepo->findByProductAndKey($productId, $key);
        return $metadata ? $metadata->meta_value : $default;
    }

    /**
     * Get all metadata for product as key-value array
     */
    public function getAllMetadata(string $productId): array
    {
        $metadata = $this->metadataRepo->listByProduct($productId);
        $result = [];
        
        foreach ($metadata as $meta) {
            $result[$meta->meta_key] = $meta->meta_value;
        }
        
        return $result;
    }

    /**
     * Delete product metadata
     */
    public function deleteMetadata(string $productId, string $key): bool
    {
        return $this->metadataRepo->deleteByProductAndKey($productId, $key);
    }

    // ==================== Product Variant Metadata ====================

    /**
     * Set variant metadata
     */
    public function setVariantMetadata(int $variantId, string $key, string $value)
    {
        return $this->variantMetadataRepo->upsert($variantId, $key, $value);
    }

    /**
     * Get variant metadata
     */
    public function getVariantMetadata(int $variantId, string $key, $default = null)
    {
        $metadata = $this->variantMetadataRepo->findByVariantAndKey($variantId, $key);
        return $metadata ? $metadata->meta_value : $default;
    }

    /**
     * Get all metadata for variant as key-value array
     */
    public function getAllVariantMetadata(int $variantId): array
    {
        $metadata = $this->variantMetadataRepo->listByVariant($variantId);
        $result = [];
        
        foreach ($metadata as $meta) {
            $result[$meta->meta_key] = $meta->meta_value;
        }
        
        return $result;
    }

    /**
     * Delete variant metadata
     */
    public function deleteVariantMetadata(int $variantId, string $key): bool
    {
        return $this->variantMetadataRepo->deleteByVariantAndKey($variantId, $key);
    }
}
