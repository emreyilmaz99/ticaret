<?php

namespace App\Repositories;

use App\Models\ProductMetadata;
use App\Repositories\Interfaces\ProductMetadataRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductMetadataRepository implements ProductMetadataRepositoryInterface
{
    protected ProductMetadata $model;

    public function __construct(ProductMetadata $model)
    {
        $this->model = $model;
    }

    public function create(array $data): ProductMetadata
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ProductMetadata
    {
        $metadata = $this->model->findOrFail($id);
        $metadata->update($data);
        return $metadata->fresh();
    }

    public function findById(int $id): ?ProductMetadata
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $metadata = $this->model->findOrFail($id);
        return (bool) $metadata->delete();
    }

    public function findByProductAndKey(string $productId, string $key): ?ProductMetadata
    {
        return $this->model->where('product_id', $productId)
            ->where('meta_key', $key)
            ->first();
    }

    public function listByProduct(string $productId): Collection
    {
        return $this->model->where('product_id', $productId)->get();
    }

    public function upsert(string $productId, string $key, string $value): ProductMetadata
    {
        return $this->model->updateOrCreate(
            [
                'product_id' => $productId,
                'meta_key' => $key,
            ],
            [
                'meta_value' => $value,
            ]
        );
    }

    public function deleteByProductAndKey(string $productId, string $key): bool
    {
        return (bool) $this->model->where('product_id', $productId)
            ->where('meta_key', $key)
            ->delete();
    }
}
