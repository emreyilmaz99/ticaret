<?php

namespace App\Repositories;

use App\Models\VendorPayout;
use App\Repositories\Interfaces\VendorPayoutRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VendorPayoutRepository implements VendorPayoutRepositoryInterface
{
    protected VendorPayout $model;

    public function __construct(VendorPayout $model)
    {
        $this->model = $model;
    }

    public function create(array $data): VendorPayout
    {
        return $this->model->create($data);
    }

    public function update($id, array $data): VendorPayout
    {
        $payout = $this->model->findOrFail($id);
        $payout->update($data);
        return $payout->fresh();
    }

    public function findById(int $id): ?VendorPayout
    {
        return $this->model->find($id);
    }

    public function listByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)
            ->orderByDesc('created_at')
            ->get();
    }
}
