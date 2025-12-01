<?php

namespace App\Repositories\Interfaces;

use App\Models\ProductVariantMetadata;
use Illuminate\Database\Eloquent\Collection;

interface ProductVariantMetadataRepositoryInterface
{
    public function create(array $data): ProductVariantMetadata;
    public function update(int $id, array $data): ProductVariantMetadata;
    public function findById(int $id): ?ProductVariantMetadata;
    public function delete(int $id): bool;
    public function findByVariantAndKey(int $variantId, string $key): ?ProductVariantMetadata;
    public function listByVariant(int $variantId): Collection;
    public function upsert(int $variantId, string $key, string $value): ProductVariantMetadata;
    public function deleteByVariantAndKey(int $variantId, string $key): bool;
}
