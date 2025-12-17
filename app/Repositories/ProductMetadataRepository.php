<?php

namespace App\Repositories;

use App\Models\ProductMetadata;
use App\Repositories\Interfaces\ProductMetadataRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductMetadataRepository extends EloquentBaseRepository implements ProductMetadataRepositoryInterface
{
    public function __construct(ProductMetadata $model)
    {
        parent::__construct($model);
    }

    public function findById(int $id): ?ProductMetadata
    {
        return $this->model->find($id);
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
