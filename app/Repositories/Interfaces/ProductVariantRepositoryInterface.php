<?php

namespace App\Repositories\Interfaces;

use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Collection;

interface ProductVariantRepositoryInterface
{
    public function create(array $data): ProductVariant;
    public function update(int $id, array $data): ProductVariant;
    public function findById(int $id): ?ProductVariant;
    public function delete(int $id): bool;
    public function listByProduct(int $productId): Collection;
}
