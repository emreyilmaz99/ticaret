<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;

interface VendorSettingsServiceInterface
{
    /**
     * Set vendor setting
     */
    public function set(int $vendorId, string $key, $value): ServiceResponse;

    /**
     * Get vendor setting
     */
    public function get(int $vendorId, string $key, $default = null);

    /**
     * Get all vendor settings
     */
    public function getAll(int $vendorId): array;

    /**
     * Delete vendor setting
     */
    public function delete(int $vendorId, string $key): ServiceResponse;

    /**
     * Set multiple settings
     */
    public function setMany(int $vendorId, array $settings): ServiceResponse;
}
