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

    /**
     * Paginate payouts with vendor for admin
     */
    public function paginateWithVendor(int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return $this->model->with('vendor')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * Find payout with vendor
     */
    public function findWithVendor(int $id): ?VendorPayout
    {
        return $this->model->with('vendor')->find($id);
    }

    /**
     * Find payout with vendor and lock for update
     */
    public function findWithVendorForUpdate(int $id): ?VendorPayout
    {
        return $this->model->with('vendor')->lockForUpdate()->find($id);
    }

    /**
     * Update payout status
     */
    public function updateStatus(int $id, string $status, ?string $processedAt = null): ?VendorPayout
    {
        $payout = $this->model->find($id);
        if (!$payout) {
            return null;
        }

        $payout->status = $status;
        if ($processedAt) {
            $payout->processed_at = $processedAt;
        }
        $payout->save();

        return $payout;
    }
}
