<?php

namespace App\Repositories;

use App\Models\VendorMedia;
use App\Repositories\Interfaces\VendorMediaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VendorMediaRepository extends EloquentBaseRepository implements VendorMediaRepositoryInterface
{
    public function __construct(VendorMedia $model)
    {
        parent::__construct($model);
    }

    public function findById(int $id): ?VendorMedia
    {
        return $this->model->find($id);
    }

    public function findByVendorAndId(int $vendorId, int $mediaId): ?VendorMedia
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('id', $mediaId)
            ->first();
    }

    public function listByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function listByVendorAndType(int $vendorId, string $type): Collection
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('type', $type)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findActiveByVendorAndType(int $vendorId, string $type): ?VendorMedia
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('type', $type)
            ->where('is_active', true)
            ->latest()
            ->first();
    }

    public function deactivateAllByType(int $vendorId, string $type): int
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('type', $type)
            ->update(['is_active' => false]);
    }
}
