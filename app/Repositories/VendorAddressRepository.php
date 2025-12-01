<?php

namespace App\Repositories;

use App\Models\VendorAddress;
use App\Repositories\Interfaces\VendorAddressRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VendorAddressRepository implements VendorAddressRepositoryInterface
{
    protected VendorAddress $model;

    public function __construct(VendorAddress $model)
    {
        $this->model = $model;
    }

    public function create(array $data): VendorAddress
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): VendorAddress
    {
        $address = $this->model->findOrFail($id);
        $address->update($data);
        return $address->fresh();
    }

    public function findById(int $id): ?VendorAddress
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $address = $this->model->findOrFail($id);
        return (bool) $address->delete();
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
