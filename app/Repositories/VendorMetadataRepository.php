<?php

namespace App\Repositories;

use App\Models\VendorMetadata;
use App\Repositories\Interfaces\VendorMetadataRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VendorMetadataRepository implements VendorMetadataRepositoryInterface
{
    protected VendorMetadata $model;

    public function __construct(VendorMetadata $model)
    {
        $this->model = $model;
    }

    public function create(array $data): VendorMetadata
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): VendorMetadata
    {
        $metadata = $this->model->findOrFail($id);
        $metadata->update($data);
        return $metadata->fresh();
    }

    public function findById(int $id): ?VendorMetadata
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $metadata = $this->model->findOrFail($id);
        return (bool) $metadata->delete();
    }

    public function findByVendorAndKey(int $vendorId, string $key): ?VendorMetadata
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('meta_key', $key)
            ->first();
    }

    public function listByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)->get();
    }

    public function upsert(int $vendorId, string $key, string $value): VendorMetadata
    {
        return $this->model->updateOrCreate(
            [
                'vendor_id' => $vendorId,
                'meta_key' => $key,
            ],
            [
                'meta_value' => $value,
            ]
        );
    }

    public function deleteByVendorAndKey(int $vendorId, string $key): bool
    {
        return (bool) $this->model->where('vendor_id', $vendorId)
            ->where('meta_key', $key)
            ->delete();
    }
}
