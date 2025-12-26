<?php

namespace App\Repositories\Interfaces;

use App\Models\VendorAddress;
use Illuminate\Database\Eloquent\Collection;

interface VendorAddressRepositoryInterface
{
    public function create(array $data): VendorAddress;
    public function update(int $id, array $data): VendorAddress;
    public function findById(int $id): ?VendorAddress;
    public function delete(int $id): bool;
    public function findByVendorAndId(int $vendorId, int $addressId): ?VendorAddress;
    public function listByVendor(int $vendorId): Collection;
    public function deleteByVendor(int $vendorId, array $exceptIds = []): int;
    public function clearPrimaryForVendor(int $vendorId): int;
    public function findPrimaryForVendor(int $vendorId): ?VendorAddress;
}
