<?php

namespace App\Interfaces\Services\Product;

use App\Models\Order;
use App\Models\ProductVariant;

interface StockServiceInterface
{
    /**
     * Decrement stocks for order
     */
    public function decrementStocksForOrder(Order $order): void;

    /**
     * Restore stocks for order
     */
    public function restoreStocksForOrder(Order $order): void;

    /**
     * Decrement stock for variant
     */
    public function decrementStock(ProductVariant $variant, int $quantity, ?string $productName = null): bool;

    /**
     * Increment stock for variant
     */
    public function incrementStock(ProductVariant $variant, int $quantity): bool;

    /**
     * Check if variant has enough stock
     */
    public function hasEnoughStock(ProductVariant $variant, int $quantity): bool;

    /**
     * Validate stocks for order
     */
    public function validateStocksForOrder(Order $order): array;
}
