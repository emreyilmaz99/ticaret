<?php

namespace App\Repositories;

use App\Models\ProductVariantMetadata;
use App\Repositories\Interfaces\ProductVariantMetadataRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductVariantMetadataRepository extends EloquentBaseRepository implements ProductVariantMetadataRepositoryInterface
{
    public function __construct(ProductVariantMetadata $model)
    {
        parent::__construct($model);
    }

    public function create(array $data): ProductVariantMetadata
    {
        return $this->model->create($data);
    }

    public function update($id, array $data): ProductVariantMetadata
    {
        $record = $this->model->findOrFail($id);
        $record->update($data);
        return $record;
    }

    public function findById(int $id): ?ProductVariantMetadata
    {
        return $this->model->find($id);
    }

    public function findByVariantAndKey(int $variantId, string $key): ?ProductVariantMetadata
    {
        return $this->model->where('variant_id', $variantId)
            ->where('meta_key', $key)
            ->first();
    }

    public function listByVariant(int $variantId): Collection
    {
        return $this->model->where('variant_id', $variantId)->get();
    }

    public function upsert(int $variantId, string $key, string $value): ProductVariantMetadata
    {
        return $this->model->updateOrCreate(
            [
                'variant_id' => $variantId,
                'meta_key' => $key,
            ],
            [
                'meta_value' => $value,
            ]
        );
    }

    public function deleteByVariantAndKey(int $variantId, string $key): bool
    {
        return (bool) $this->model->where('variant_id', $variantId)
            ->where('meta_key', $key)
            ->delete();
    }
}
