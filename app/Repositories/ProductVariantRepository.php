<?php

namespace App\Repositories;

use App\Models\ProductVariant;
use App\Repositories\Interfaces\ProductVariantRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductVariantRepository implements ProductVariantRepositoryInterface
{
    protected ProductVariant $model;

    public function __construct(ProductVariant $model)
    {
        $this->model = $model;
    }

    public function create(array $data): ProductVariant
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ProductVariant
    {
        $variant = $this->model->findOrFail($id);
        $variant->update($data);
        return $variant->fresh();
    }

    public function findById(int $id): ?ProductVariant
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $variant = $this->model->findOrFail($id);
        return (bool) $variant->delete();
    }

    public function listByProduct(int $productId): Collection
    {
        return $this->model->where('product_id', $productId)->get();
    }
}
