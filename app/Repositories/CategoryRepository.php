<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CategoryRepository implements CategoryRepositoryInterface
{
    protected Category $model;

    public function __construct(Category $model)
    {
        $this->model = $model;
    }

    public function create(array $data): Category
    {
        return $this->model->create($data);
    }

    public function update($id, array $data): Category
    {
        $category = $this->model->findOrFail($id);
        $category->update($data);
        return $category->fresh();
    }

    public function findById(int $id): ?Category
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $category = $this->model->findOrFail($id);
        return (bool) $category->delete();
    }

    public function listByVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('vendor_id', $vendorId)
            ->orderBy('sort_order', 'asc')
            ->paginate($perPage);
    }

    public function listByVendorWithDetails(int $vendorId, int $perPage = 100): LengthAwarePaginator
    {
        return $this->model->where('vendor_id', $vendorId)
            ->with('parent:id,name')
            ->withCount(['products', 'children'])
            ->orderBy('parent_id', 'asc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate($perPage);
    }

    public function existsBySlug(string $slug): bool
    {
        return $this->model->where('slug', $slug)->exists();
    }

    public function existsBySlugForVendor(string $slug, int $vendorId): bool
    {
        // Only check non-deleted categories for slug uniqueness
        return $this->model->where('slug', $slug)
            ->where('vendor_id', $vendorId)
            ->whereNull('deleted_at')
            ->exists();
    }

    public function existsBySlugExcept(string $slug, int $exceptId): bool
    {
        return $this->model->where('slug', $slug)
            ->where('id', '!=', $exceptId)
            ->exists();
    }

    public function existsBySlugForVendorExcept(string $slug, int $vendorId, int $exceptId): bool
    {
        return $this->model->where('slug', $slug)
            ->where('vendor_id', $vendorId)
            ->where('id', '!=', $exceptId)
            ->exists();
    }
}
