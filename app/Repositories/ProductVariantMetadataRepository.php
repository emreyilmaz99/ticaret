<?php

namespace App\Repositories;

use App\Models\ProductVariantMetadata;
use App\Repositories\Interfaces\ProductVariantMetadataRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductVariantMetadataRepository implements ProductVariantMetadataRepositoryInterface
{
    protected ProductVariantMetadata $model;

    public function __construct(ProductVariantMetadata $model)
    {
        $this->model = $model;
    }

    public function create(array $data): ProductVariantMetadata
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ProductVariantMetadata
    {
        $metadata = $this->model->findOrFail($id);
        $metadata->update($data);
        return $metadata->fresh();
    }

    public function findById(int $id): ?ProductVariantMetadata
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $metadata = $this->model->findOrFail($id);
        return (bool) $metadata->delete();
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
