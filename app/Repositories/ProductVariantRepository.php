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

    public function update($id, array $data): ProductVariant
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

    public function listByProduct(string $productId): Collection
    {
        return $this->model->where('product_id', $productId)->get();
    }

    /**
     * Find variant by ID and product ID
     */
    public function findByIdAndProduct(int $variantId, string $productId): ?ProductVariant
    {
        return $this->model
            ->where('id', $variantId)
            ->where('product_id', $productId)
            ->first();
    }

    /**
     * Get first variant for product
     */
    public function getFirstForProduct(string $productId): ?ProductVariant
    {
        return $this->model
            ->where('product_id', $productId)
            ->first();
    }

    /**
     * Decrement stock (atomic operation)
     */
    public function decrementStock(int $variantId, int $quantity): bool
    {
        $variant = $this->model->find($variantId);
        if (!$variant) {
            return false;
        }
        return $variant->decrementStock($quantity);
    }

    /**
     * Increment stock (atomic operation)
     */
    public function incrementStock(int $variantId, int $quantity): bool
    {
        $variant = $this->model->find($variantId);
        if (!$variant) {
            return false;
        }
        return $variant->incrementStock($quantity);
    }

    /**
     * Check if variant has enough stock
     */
    public function hasStock(int $variantId, int $quantity): bool
    {
        $variant = $this->model->find($variantId);
        if (!$variant) {
            return false;
        }
        return $variant->hasStock($quantity);
    }

    /**
     * Get current stock amount
     */
    public function getStock(int $variantId): int
    {
        $variant = $this->model->find($variantId);
        return $variant ? $variant->stock : 0;
    }

    /**
     * Get fresh variant data
     */
    public function fresh(int $variantId): ?ProductVariant
    {
        return $this->model->find($variantId);
    }
}
