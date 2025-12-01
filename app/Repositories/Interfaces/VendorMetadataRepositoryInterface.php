<?php

namespace App\Repositories\Interfaces;

use App\Models\VendorMetadata;
use Illuminate\Database\Eloquent\Collection;

interface VendorMetadataRepositoryInterface
{
    public function create(array $data): VendorMetadata;
    public function update(int $id, array $data): VendorMetadata;
    public function findById(int $id): ?VendorMetadata;
    public function delete(int $id): bool;
    public function findByVendorAndKey(int $vendorId, string $key): ?VendorMetadata;
    public function listByVendor(int $vendorId): Collection;
    public function upsert(int $vendorId, string $key, string $value): VendorMetadata;
    public function deleteByVendorAndKey(int $vendorId, string $key): bool;
}
