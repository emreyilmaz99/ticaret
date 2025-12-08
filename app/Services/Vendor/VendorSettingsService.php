<?php

namespace App\Services\Vendor;

use App\Services\BaseService;
use App\Core\ServiceResponse;
use App\Repositories\Interfaces\VendorSettingRepositoryInterface;

class VendorSettingsService extends BaseService
{
    protected VendorSettingRepositoryInterface $settingRepo;

    public function __construct(VendorSettingRepositoryInterface $settingRepo)
    {
        $this->settingRepo = $settingRepo;
    }

    /**
     * Ayar kaydet (otomatik tip algılama ile)
     */
    public function set(int $vendorId, string $key, $value): ServiceResponse
    {
        try {
            $setting = $this->settingRepo->upsert($vendorId, $key, $value);
            return $this->successResponse($setting, 'Setting saved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to save setting');
        }
    }

    /**
     * Ayar getir (tipli değer ile)
     */
    public function get(int $vendorId, string $key, $default = null)
    {
        $setting = $this->settingRepo->findByVendorAndKey($vendorId, $key);
        return $setting ? $setting->getTypedValueAttribute() : $default;
    }

    /**
     * Tüm ayarları key-value array olarak getir
     */
    public function getAll(int $vendorId): array
    {
        $settings = $this->settingRepo->listByVendor($vendorId);
        $result = [];

        foreach ($settings as $setting) {
            $result[$setting->setting_key] = $setting->getTypedValueAttribute();
        }

        return $result;
    }

    /**
     * Ayar sil
     */
    public function delete(int $vendorId, string $key): ServiceResponse
    {
        try {
            $deleted = $this->settingRepo->deleteByVendorAndKey($vendorId, $key);

            if (!$deleted) {
                return $this->errorResponse('Setting not found', 404);
            }

            return $this->successResponse(null, 'Setting deleted successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to delete setting');
        }
    }

    /**
     * Birden fazla ayarı toplu kaydet
     */
    public function setMany(int $vendorId, array $settings): ServiceResponse
    {
        try {
            foreach ($settings as $key => $value) {
                $this->settingRepo->upsert($vendorId, $key, $value);
            }

            return $this->successResponse(null, 'Settings saved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to save settings');
        }
    }
}
