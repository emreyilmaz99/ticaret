<?php

namespace App\Repositories;

use App\Models\VendorRating;
use App\Repositories\Interfaces\VendorRatingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class VendorRatingRepository implements VendorRatingRepositoryInterface
{
    protected VendorRating $model;

    public function __construct(VendorRating $model)
    {
        $this->model = $model;
    }

    public function create(array $data): VendorRating
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): VendorRating
    {
        $rating = $this->model->findOrFail($id);
        $rating->update($data);
        return $rating->fresh();
    }

    public function findById(int $id): ?VendorRating
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $rating = $this->model->findOrFail($id);
        return (bool) $rating->delete();
    }

    public function findByVendorUserOrder(int $vendorId, int $userId, ?int $orderId): ?VendorRating
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('user_id', $userId)
            ->where('order_id', $orderId)
            ->first();
    }

    public function listByVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('vendor_id', $vendorId)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function listApprovedByVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('vendor_id', $vendorId)
            ->approved()
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function listByUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)
            ->with(['vendor'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function approve(int $id): bool
    {
        $rating = $this->model->findOrFail($id);
        return $rating->approve();
    }

    public function getAverageRating(int $vendorId): float
    {
        return (float) $this->model->where('vendor_id', $vendorId)
            ->approved()
            ->avg('rating') ?? 0;
    }

    public function getRatingCount(int $vendorId): int
    {
        return $this->model->where('vendor_id', $vendorId)
            ->approved()
            ->count();
    }
}
