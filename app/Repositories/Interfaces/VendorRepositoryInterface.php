<?php

namespace App\Repositories\Interfaces;

use App\Models\Vendor;

interface VendorRepositoryInterface
{
    public function create(array $data): Vendor;
    public function update(Vendor $vendor, array $data): Vendor;
    public function findById($id): ?Vendor;
}
