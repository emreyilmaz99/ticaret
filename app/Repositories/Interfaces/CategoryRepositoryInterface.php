<?php

namespace App\Repositories\Interfaces;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    public function create(array $data): Category;
    public function update(int $id, array $data): Category;
    public function findById(int $id): ?Category;
    public function delete(int $id): bool;
    public function listByVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator;
    public function listByVendorWithDetails(int $vendorId, int $perPage = 100): LengthAwarePaginator;
    public function existsBySlug(string $slug): bool;
    public function existsBySlugForVendor(string $slug, int $vendorId): bool;
    public function existsBySlugExcept(string $slug, int $exceptId): bool;
    public function existsBySlugForVendorExcept(string $slug, int $vendorId, int $exceptId): bool;
    
    // Public API methods
    public function listActivePublic(array $filters = []);
    public function getActiveTree();
    public function findActiveBySlug(string $slug): ?Category;
    public function hasChildren(int $id): bool;
    public function getCategoryWithChildrenIds(int $categoryId): array;
    public function getCategoryWithChildrenIdsBySlug(string $slug): array;
    public function getMainCategoriesWithProductCounts();
}
