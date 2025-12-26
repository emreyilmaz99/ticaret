<?php

namespace App\Repositories;

use App\Models\VendorShippingSetting;

class VendorShippingSettingRepository extends EloquentBaseRepository
{
    public function __construct(VendorShippingSetting $model)
    {
        parent::__construct($model);
    }

    /**
     * Get settings for vendor (returns default values if not found)
     */
    public function getForVendor(int $vendorId): VendorShippingSetting
    {
        $settings = $this->model->where('vendor_id', $vendorId)->first();
        
        if ($settings) {
            return $settings;
        }
        
        // Return new instance with default values (without saving)
        $default = new VendorShippingSetting();
        $default->vendor_id = $vendorId;
        $default->shipping_cost = VendorShippingSetting::DEFAULT_SHIPPING_COST;
        $default->free_shipping_threshold = VendorShippingSetting::DEFAULT_FREE_SHIPPING_THRESHOLD;
        $default->is_shipping_enabled = true;
        
        return $default;
    }

    /**
     * Get or create default settings for vendor
     */
    public function getOrCreateDefault(int $vendorId): VendorShippingSetting
    {
        return $this->model->firstOrCreate(
            ['vendor_id' => $vendorId],
            [
                'shipping_cost' => VendorShippingSetting::DEFAULT_SHIPPING_COST,
                'free_shipping_threshold' => VendorShippingSetting::DEFAULT_FREE_SHIPPING_THRESHOLD,
                'is_shipping_enabled' => true,
            ]
        );
    }

    /**
     * Update settings for vendor
     */
    public function updateForVendor(int $vendorId, array $data): VendorShippingSetting
    {
        $settings = $this->getOrCreateDefault($vendorId);
        $settings->update($data);
        return $settings->refresh();
    }
}
