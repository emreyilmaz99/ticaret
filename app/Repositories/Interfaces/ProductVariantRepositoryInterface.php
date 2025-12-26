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
    public function listByProduct(string $productId): Collection;
    public function findByIdAndProduct(int $variantId, string $productId): ?ProductVariant;
    public function getFirstForProduct(string $productId): ?ProductVariant;
    
    // Stock management methods
    public function decrementStock(int $variantId, int $quantity): bool;
    public function incrementStock(int $variantId, int $quantity): bool;
    public function hasStock(int $variantId, int $quantity): bool;
    public function getStock(int $variantId): int;
    public function fresh(int $variantId): ?ProductVariant;
}
