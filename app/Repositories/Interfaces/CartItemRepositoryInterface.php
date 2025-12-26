<?php

namespace App\Repositories\Interfaces;

use App\Models\CartItem;
use App\Models\Cart;
use App\Repositories\Interfaces\BaseRepositoryInterface;

interface CartItemRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find item in cart by product and variant
     */
    public function findByCartProductVariant(int $cartId, string $productId, ?int $variantId): ?CartItem;

    /**
     * Add item to cart
     */
    public function addItem(Cart $cart, array $data): CartItem;

    /**
     * Update item quantity
     */
    public function updateQuantity(CartItem $item, int $quantity): CartItem;

    /**
     * Increment item quantity
     */
    public function incrementQuantity(CartItem $item, int $amount = 1): CartItem;

    /**
     * Remove item from cart
     */
    public function removeItem(CartItem $item): bool;

    /**
     * Get all items for cart
     */
    public function getItemsForCart(int $cartId): \Illuminate\Database\Eloquent\Collection;

    /**
     * Update cart item price
     */
    public function updatePrice(CartItem $item, float $unitPrice): CartItem;
}
