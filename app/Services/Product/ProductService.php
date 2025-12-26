<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Product\ProductServiceInterface;
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

class ProductService extends BaseService implements ProductServiceInterface
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
                $productType = $data['type'] ?? 'simple';
                
                // Prepare product data
                $data = $this->prepareProductData($vendor, $data);
                
                // Extract relations and variant data
                $relations = $this->extractRelationData($data);
                $variantData = $this->extractDefaultVariantData($data);

                // Create product
                $product = $this->repo->create($data);

                // Process relations
                $this->processProductRelations($product, $relations, $variantData, $productType);

                return $this->repo->freshWithRelations($product->id);
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

                // Process all relations
                $this->processUpdateRelations($product, $data);

                // Update product via repository
                $this->repo->update($product->id, $data);
                return $this->repo->freshWithRelations($product->id);
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
        $this->executeWithVendorValidation(
            $vendor,
            $product,
            fn() => $this->repo->delete($product->id),
            'Ürün silme hatası'
        );
    }

    public function deletePhotoForVendor(Vendor $vendor, Product $product, int $photoId): void
    {
        $this->executeWithVendorValidation(
            $vendor,
            $product,
            fn() => $this->photoRepo->delete($photoId),
            'Fotoğraf silme hatası'
        );
    }

    public function findForVendor(Vendor $vendor, $productId): ?Product
    {
        return $this->repo->findForVendor($vendor->id, $productId);
    }

    // ==================== Helper Methods ====================

    /**
     * Prepare product data with vendor and category sanitization
     */
    protected function prepareProductData(Vendor $vendor, array $data): array
    {
        $data['vendor_id'] = $vendor->id;
        $data['status'] = $data['status'] ?? 'pending';

        if (array_key_exists('category_id', $data)) {
            $data['category_id'] = $this->sanitizeCategoryId($data['category_id']);
        }

        $data['slug'] = $this->generateUniqueSlug(
            $data['name'] ?? 'product',
            $data['slug'] ?? null
        );

        return $data;
    }

    /**
     * Extract relation data from product data array
     */
    protected function extractRelationData(array &$data): array
    {
        $relations = [
            'tags' => $data['tags'] ?? null,
            'variants' => $data['variants'] ?? null,
            'images' => $data['images'] ?? null,
        ];

        unset($data['tags'], $data['variants'], $data['images']);

        return $relations;
    }

    /**
     * Extract default variant data for simple products
     */
    protected function extractDefaultVariantData(array &$data): array
    {
        $variantData = [
            'price' => $data['price'] ?? null,
            'stock' => $data['stock'] ?? null,
            'sku' => $data['sku'] ?? null,
            'weight' => $data['weight'] ?? null,
            'length' => $data['length'] ?? null,
            'width' => $data['width'] ?? null,
            'height' => $data['height'] ?? null,
            'unit_id' => $data['unit_id'] ?? null,
        ];

        unset(
            $data['price'],
            $data['stock'],
            $data['sku'],
            $data['weight'],
            $data['length'],
            $data['width'],
            $data['height'],
            $data['unit_id']
        );

        return $variantData;
    }

    /**
     * Process product relations (tags, variants, images)
     */
    protected function processProductRelations(Product $product, array $relations, array $variantData, string $productType): void
    {
        // Sync tags
        if ($relations['tags']) {
            $this->syncProductTags($product, $relations['tags']);
        }

        // Create variants
        if (!empty($relations['variants']) && is_array($relations['variants'])) {
            $this->createVariants($product->id, $relations['variants']);
        } elseif ($productType === 'simple') {
            $this->createDefaultVariant($product->id, $variantData);
        }

        // Handle image uploads
        if (!empty($relations['images']) && is_array($relations['images'])) {
            $this->handleImageUploads($product->id, $relations['images'], $product->name);
        }
    }

    /**
     * Process product update relations (images, tags, variants)
     */
    protected function processUpdateRelations(Product $product, array &$data): void
    {
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
    }

    /**
     * Execute action with vendor validation and error handling
     */
    protected function executeWithVendorValidation(
        Vendor $vendor,
        Product $product,
        callable $action,
        string $errorMessage
    ) {
        try {
            $this->validateVendorOwnership($product, $vendor);
            return $action();
        } catch (\Exception $e) {
            Log::error($errorMessage . ': ' . $e->getMessage());
            throw $e;
        }
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
