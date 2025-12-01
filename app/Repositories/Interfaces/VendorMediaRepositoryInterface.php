<?php

namespace App\Repositories\Interfaces;

use App\Models\VendorMedia;
use Illuminate\Database\Eloquent\Collection;

interface VendorMediaRepositoryInterface
{
    public function create(array $data): VendorMedia;
    public function update(int $id, array $data): VendorMedia;
    public function findById(int $id): ?VendorMedia;
    public function delete(int $id): bool;
    public function findByVendorAndId(int $vendorId, int $mediaId): ?VendorMedia;
    public function listByVendor(int $vendorId): Collection;
    public function listByVendorAndType(int $vendorId, string $type): Collection;
    public function findActiveByVendorAndType(int $vendorId, string $type): ?VendorMedia;
    public function deactivateAllByType(int $vendorId, string $type): int;
}
