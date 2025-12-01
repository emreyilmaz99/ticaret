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

    public function update(int $id, array $data): Category
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

    public function existsBySlug(string $slug): bool
    {
        return $this->model->where('slug', $slug)->exists();
    }
}
