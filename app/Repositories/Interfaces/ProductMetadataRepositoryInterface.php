<?php

namespace App\Repositories\Interfaces;

use App\Models\ProductMetadata;
use Illuminate\Database\Eloquent\Collection;

interface ProductMetadataRepositoryInterface
{
    public function create(array $data): ProductMetadata;
    public function update(int $id, array $data): ProductMetadata;
    public function findById(int $id): ?ProductMetadata;
    public function delete(int $id): bool;
    public function findByProductAndKey(string $productId, string $key): ?ProductMetadata;
    public function listByProduct(string $productId): Collection;
    public function upsert(string $productId, string $key, string $value): ProductMetadata;
    public function deleteByProductAndKey(string $productId, string $key): bool;
}
