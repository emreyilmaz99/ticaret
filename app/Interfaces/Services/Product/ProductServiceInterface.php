<?php

namespace App\Interfaces\Services\Product;

use App\Core\ServiceResponse;
use App\Models\Product;
use App\Models\Vendor;

interface ProductServiceInterface
{
    /**
     * Create product for vendor
     */
    public function createForVendor(Vendor $vendor, array $data): Product;

    /**
     * Update product for vendor
     */
    public function updateForVendor(Vendor $vendor, Product $product, array $data): Product;

    /**
     * List products for vendor
     */
    public function listForVendor(Vendor $vendor, int $perPage = 15);

    /**
     * Delete product for vendor
     */
    public function deleteForVendor(Vendor $vendor, Product $product): void;

    /**
     * Delete product photo for vendor
     */
    public function deletePhotoForVendor(Vendor $vendor, Product $product, int $photoId): void;

    /**
     * Find product for vendor
     */
    public function findForVendor(Vendor $vendor, $productId): ?Product;

    /**
     * Set product setting
     */
    public function setSetting(string $productId, string $key, $value);

    /**
     * Get product setting
     */
    public function getSetting(string $productId, string $key, $default = null);

    /**
     * Get all product settings
     */
    public function getAllSettings(string $productId): array;

    /**
     * Delete product setting
     */
    public function deleteSetting(string $productId, string $key): bool;

    /**
     * Set product metadata
     */
    public function setMetadata(string $productId, string $key, string $value);

    /**
     * Get product metadata
     */
    public function getMetadata(string $productId, string $key, $default = null);

    /**
     * Get all product metadata
     */
    public function getAllMetadata(string $productId): array;

    /**
     * Delete product metadata
     */
    public function deleteMetadata(string $productId, string $key): bool;

    /**
     * Set variant metadata
     */
    public function setVariantMetadata(int $variantId, string $key, string $value);

    /**
     * Get variant metadata
     */
    public function getVariantMetadata(int $variantId, string $key, $default = null);

    /**
     * Get all variant metadata
     */
    public function getAllVariantMetadata(int $variantId): array;

    /**
     * Delete variant metadata
     */
    public function deleteVariantMetadata(int $variantId, string $key): bool;
}
