<?php

namespace App\Repositories;

use App\Models\VendorAddress;
use App\Repositories\Interfaces\VendorAddressRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VendorAddressRepository extends EloquentBaseRepository implements VendorAddressRepositoryInterface
{
    public function __construct(VendorAddress $model)
    {
        parent::__construct($model);
    }

    public function findById(int $id): ?VendorAddress
    {
        return $this->model->find($id);
    }

    public function findByVendorAndId(int $vendorId, int $addressId): ?VendorAddress
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('id', $addressId)
            ->first();
    }

    public function listByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)->get();
    }

    public function deleteByVendor(int $vendorId, array $exceptIds = []): int
    {
        $query = $this->model->where('vendor_id', $vendorId);
        
        if (!empty($exceptIds)) {
            $query->whereNotIn('id', $exceptIds);
        }
        
        return $query->delete();
    }

    public function clearPrimaryForVendor(int $vendorId): int
    {
        return $this->model->where('vendor_id', $vendorId)
            ->update(['is_primary' => false]);
    }
}
