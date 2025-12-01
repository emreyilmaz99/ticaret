<?php

namespace App\Repositories\Interfaces;

use App\Models\VendorRating;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface VendorRatingRepositoryInterface
{
    public function create(array $data): VendorRating;
    public function update(int $id, array $data): VendorRating;
    public function findById(int $id): ?VendorRating;
    public function delete(int $id): bool;
    public function findByVendorUserOrder(int $vendorId, int $userId, ?int $orderId): ?VendorRating;
    public function listByVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator;
    public function listApprovedByVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator;
    public function listByUser(int $userId, int $perPage = 15): LengthAwarePaginator;
    public function approve(int $id): bool;
    public function getAverageRating(int $vendorId): float;
    public function getRatingCount(int $vendorId): int;
}
