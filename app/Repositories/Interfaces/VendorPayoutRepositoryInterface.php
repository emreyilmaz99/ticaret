<?php

namespace App\Repositories\Interfaces;

use App\Models\VendorPayout;
use Illuminate\Database\Eloquent\Collection;

interface VendorPayoutRepositoryInterface
{
    public function create(array $data): VendorPayout;
    public function update(int $id, array $data): VendorPayout;
    public function findById(int $id): ?VendorPayout;
    public function listByVendor(int $vendorId): Collection;
}
