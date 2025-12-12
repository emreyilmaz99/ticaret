<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
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
use App\Traits\ManagesProductData;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductService extends BaseService
{
    use ManagesProductData;
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
        try {
            return DB::transaction(function () use ($vendor, $data) {
                // Ensure vendor ownership
                $data['vendor_id'] = $vendor->id;
                $data['status'] = $data['status'] ?? 'pending';

                // Sanitize category_id
                if (array_key_exists('category_id', $data)) {
                    $data['category_id'] = $this->sanitizeCategoryId($data['category_id']);
                }

                // Extract relations
                $tags = $data['tags'] ?? null;
                $variants = $data['variants'] ?? null;
                $images = $data['images'] ?? null;
                unset($data['tags'], $data['variants'], $data['images']);

                // Capture default variant data for simple products
                $defaultVariantData = [
                    'price' => $data['price'] ?? null,
                    'stock' => $data['stock'] ?? null,
                    'sku' => $data['sku'] ?? null,
                    'weight' => $data['weight'] ?? null,
                    'length' => $data['length'] ?? null,
                    'width' => $data['width'] ?? null,
                    'height' => $data['height'] ?? null,
                    'unit_id' => $data['unit_id'] ?? null,
                ];
                
                // Remove variant-specific fields from product data
                unset($data['price'], $data['stock'], $data['weight'], $data['length'], $data['width'], $data['height'], $data['unit_id']);

                // Generate unique slug
                $data['slug'] = $this->generateUniqueSlug(
                    $data['name'] ?? 'product', 
                    $data['slug'] ?? null
                );

                // Create product
                $product = $this->repo->create($data);

                // Sync tags
                if ($tags) {
                    $this->syncProductTags($product, $tags);
                }

                // Create variants
                if (!empty($variants) && is_array($variants)) {
                    $this->createVariants($product->id, $variants);
                } elseif (($data['type'] ?? 'simple') === 'simple') {
                    // Create default variant for simple product
                    $this->createDefaultVariant($product->id, $defaultVariantData);
                }

                // Handle image uploads
                if (!empty($images) && is_array($images)) {
                    $this->handleImageUploads($product->id, $images, $product->name);
                }

                return $product->refresh();
            });
        } catch (\Exception $e) {
            Log::error('Ürün oluşturma hatası: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateForVendor(Vendor $vendor, Product $product, array $data): Product
    {
        try {
            // Verify ownership
            $this->validateVendorOwnership($product, $vendor);
            
            return DB::transaction(function () use ($product, $data) {
                // Prevent changing vendor_id
                unset($data['vendor_id']);

                // Handle image uploads
                if (isset($data['images']) && is_array($data['images'])) {
                    $this->handleImageUploads($product->id, $data['images'], $product->name);
                    unset($data['images']);
                }

                // Handle tags
                if (isset($data['tags'])) {
                    $this->syncProductTags($product, $data['tags']);
                    unset($data['tags']);
                }

                // Handle simple product variant updates
                if ($product->type === 'simple') {
                    $this->updateSimpleProductVariant($product, $data);
                    unset($data['price'], $data['stock'], $data['sku'], $data['unit_id']);
                }

                // Handle variable product variants
                if (isset($data['variants']) && is_array($data['variants'])) {
                    $this->updateVariants($product, $data['variants']);
                    unset($data['variants']);
                }

                // Update product via repository
                $updated = $this->repo->update($product->id, $data);
                return is_object($updated) ? $updated->refresh() : $this->repo->findById($product->id);
            });
        } catch (\Exception $e) {
            Log::error('Ürün güncelleme hatası: ' . $e->getMessage());
            throw $e;
        }
    }

    public function listForVendor(Vendor $vendor, int $perPage = 15)
    {
        return $this->repo->listForVendor($vendor->id, $perPage);
    }

    public function deleteForVendor(Vendor $vendor, Product $product): void
    {
        try {
            // Verify ownership
            $this->validateVendorOwnership($product, $vendor);
            
            $this->repo->delete($product->id);
        } catch (\Exception $e) {
            Log::error('Ürün silme hatası: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deletePhotoForVendor(Vendor $vendor, Product $product, int $photoId): void
    {
        try {
            // Verify ownership
            $this->validateVendorOwnership($product, $vendor);
            
            // Delete photo
            $this->photoRepo->delete($photoId);
        } catch (\Exception $e) {
            Log::error('Fotoğraf silme hatası: ' . $e->getMessage());
            throw $e;
        }
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
