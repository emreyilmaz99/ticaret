<?php

namespace App\Interfaces\Services\Product;

use App\Models\ProductVariant;

interface ProductVariantServiceInterface
{
    public function createVariant(int $productId, array $data): ProductVariant;
    public function updateVariant(int $variantId, array $data): ProductVariant;
    public function deleteVariant(int $variantId): bool;
    public function getProductVariants(int $productId);
    public function getVariant(int $variantId): ?ProductVariant;
    public function checkStock(int $variantId, int $quantity): bool;
    public function updateStock(int $variantId, int $stock): ProductVariant;
    public function incrementStock(int $variantId, int $amount): ProductVariant;
    public function decrementStock(int $variantId, int $amount): ProductVariant;
    public function syncVariants(int $productId, array $variants): void;
}
