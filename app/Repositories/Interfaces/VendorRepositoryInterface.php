<?php

namespace App\Repositories\Interfaces;

use App\Models\Vendor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface VendorRepositoryInterface
{
    public function create(array $data): Vendor;
    public function update($id, array $data): Vendor;
    public function findById($id): ?Vendor;
    public function findBySlug(string $slug): ?Vendor;
    public function findActiveBySlug(string $slug): ?Vendor;
    public function findByEmail(string $email): ?Vendor;
    public function findWithStats(int $id): ?Vendor;
    public function listForAdmin(int $perPage = 15, ?string $status = null);
    public function getStatistics(): array;
    public function getActiveProductCount(int $vendorId): int;
    public function getVendorProducts(int $vendorId, array $filters, int $perPage = 20);
    public function getVendorCategoriesWithCount(int $vendorId): array;
    public function getVendorReviews(int $vendorId, array $filters, int $perPage = 10);
    public function getReviewDistribution(int $vendorId): array;
    public function paginateOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at']);
    public function getProductIds(int $vendorId): array;
}
