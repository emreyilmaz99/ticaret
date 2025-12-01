<?php

namespace App\Repositories\Interfaces;

use App\Models\VendorSetting;
use Illuminate\Database\Eloquent\Collection;

interface VendorSettingRepositoryInterface
{
    public function create(array $data): VendorSetting;
    public function update(int $id, array $data): VendorSetting;
    public function findById(int $id): ?VendorSetting;
    public function delete(int $id): bool;
    public function findByVendorAndKey(int $vendorId, string $key): ?VendorSetting;
    public function listByVendor(int $vendorId): Collection;
    public function upsert(int $vendorId, string $key, $value): VendorSetting;
    public function deleteByVendorAndKey(int $vendorId, string $key): bool;
}
