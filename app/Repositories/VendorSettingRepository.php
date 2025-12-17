<?php

namespace App\Repositories;

use App\Models\VendorSetting;
use App\Repositories\Interfaces\VendorSettingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VendorSettingRepository extends EloquentBaseRepository implements VendorSettingRepositoryInterface
{
    public function __construct(VendorSetting $model)
    {
        parent::__construct($model);
    }

    public function findById(int $id): ?VendorSetting
    {
        return $this->model->find($id);
    }

    public function findByVendorAndKey(int $vendorId, string $key): ?VendorSetting
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('setting_key', $key)
            ->first();
    }

    public function listByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)->get();
    }

    public function upsert(int $vendorId, string $key, $value): VendorSetting
    {
        $setting = $this->findByVendorAndKey($vendorId, $key);
        
        if ($setting) {
            $setting->setTypedValue($value);
            $setting->save();
            return $setting;
        }
        
        $setting = new VendorSetting([
            'vendor_id' => $vendorId,
            'setting_key' => $key,
        ]);
        $setting->setTypedValue($value);
        $setting->save();
        
        return $setting;
    }

    public function deleteByVendorAndKey(int $vendorId, string $key): bool
    {
        return (bool) $this->model->where('vendor_id', $vendorId)
            ->where('setting_key', $key)
            ->delete();
    }
}
