<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;

interface VendorShippingSettingServiceInterface
{
    /**
     * Get vendor shipping settings
     */
    public function getSettings(int $vendorId): ServiceResponse;

    /**
     * Update vendor shipping settings
     */
    public function updateSettings(int $vendorId, array $data): ServiceResponse;
}
