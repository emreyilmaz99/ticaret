<?php

namespace App\Services\Product;

use App\Interfaces\Services\Product\ProductMetadataServiceInterface;
use App\Services\BaseService;
use App\Repositories\Interfaces\ProductSettingRepositoryInterface;
use App\Repositories\Interfaces\ProductMetadataRepositoryInterface;

/**
 * ProductMetadataService
 * 
 * Handles product settings and metadata (SEO, custom fields).
 */
class ProductMetadataService extends BaseService implements ProductMetadataServiceInterface
{
    protected ProductSettingRepositoryInterface $settingRepo;
    protected ProductMetadataRepositoryInterface $metadataRepo;

    public function __construct(
        ProductSettingRepositoryInterface $settingRepo,
        ProductMetadataRepositoryInterface $metadataRepo
    ) {
        $this->settingRepo = $settingRepo;
        $this->metadataRepo = $metadataRepo;
    }

    /**
     * Set product setting
     */
    public function setSetting(string $productId, string $key, $value)
    {
        return $this->settingRepo->upsert($productId, $key, $value);
    }

    /**
     * Get product setting
     */
    public function getSetting(string $productId, string $key, $default = null)
    {
        $setting = $this->settingRepo->findByProductAndKey($productId, $key);
        return $setting ? $setting->getTypedValueAttribute() : $default;
    }

    /**
     * Get all product settings
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
     * Get all product metadata
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
     * Set many settings at once
     */
    public function setManySettings(string $productId, array $settings): void
    {
        foreach ($settings as $key => $value) {
            $this->settingRepo->upsert($productId, $key, $value);
        }
    }

    /**
     * Set many metadata at once
     */
    public function setManyMetadata(string $productId, array $metadata): void
    {
        foreach ($metadata as $key => $value) {
            $this->metadataRepo->upsert($productId, $key, $value);
        }
    }

    /**
     * Delete setting
     */
    public function deleteSetting(string $productId, string $key): bool
    {
        return $this->settingRepo->deleteByProductAndKey($productId, $key);
    }

    /**
     * Delete metadata
     */
    public function deleteMetadata(string $productId, string $key): bool
    {
        return $this->metadataRepo->deleteByProductAndKey($productId, $key);
    }
}
