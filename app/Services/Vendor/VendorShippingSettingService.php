<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorShippingSettingServiceInterface;
use App\Core\ServiceResponse;
use App\Models\VendorShippingSetting;
use App\Services\BaseService;

class VendorShippingSettingService extends BaseService implements VendorShippingSettingServiceInterface
{
    /**
     * Satıcının kargo ayarlarını getir veya varsayılan değerlerle oluştur
     */
    public function getSettings(int $vendorId): ServiceResponse
    {
        $settings = VendorShippingSetting::getOrCreateDefault($vendorId);

        $data = [
            'shipping_cost' => (float) $settings->shipping_cost,
            'free_shipping_threshold' => (float) $settings->free_shipping_threshold,
            'is_shipping_enabled' => $settings->is_shipping_enabled,
            'defaults' => [
                'shipping_cost' => VendorShippingSetting::DEFAULT_SHIPPING_COST,
                'free_shipping_threshold' => VendorShippingSetting::DEFAULT_FREE_SHIPPING_THRESHOLD,
            ],
        ];

        return $this->successResponse($data, 'Kargo ayarları başarıyla getirildi.');
    }

    /**
     * Satıcının kargo ayarlarını güncelle
     */
    public function updateSettings(int $vendorId, array $data): ServiceResponse
    {
        $settings = VendorShippingSetting::updateOrCreate(
            ['vendor_id' => $vendorId],
            [
                'shipping_cost' => $data['shipping_cost'],
                'free_shipping_threshold' => $data['free_shipping_threshold'],
                'is_shipping_enabled' => $data['is_shipping_enabled'],
            ]
        );

        $result = [
            'shipping_cost' => (float) $settings->shipping_cost,
            'free_shipping_threshold' => (float) $settings->free_shipping_threshold,
            'is_shipping_enabled' => $settings->is_shipping_enabled,
        ];

        return $this->successResponse($result, 'Kargo ayarları başarıyla güncellendi.');
    }
}
