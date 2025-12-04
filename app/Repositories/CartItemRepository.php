<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Repositories\Interfaces\CartItemRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CartItemRepository extends EloquentBaseRepository implements CartItemRepositoryInterface
{
    public function __construct(CartItem $model)
    {
        parent::__construct($model);
    }

    /**
     * Find item in cart by product and variant
     */
    public function findByCartProductVariant(int $cartId, string $productId, ?int $variantId): ?CartItem
    {
        return $this->model
            ->where('cart_id', $cartId)
            ->where('product_id', $productId)
            ->where('variant_id', $variantId)
            ->first();
    }

    /**
     * Add item to cart
     */
    public function addItem(Cart $cart, array $data): CartItem
    {
        return $cart->items()->create($data);
    }

    /**
     * Update item quantity
     */
    public function updateQuantity(CartItem $item, int $quantity): CartItem
    {
        $item->update(['quantity' => $quantity]);
        return $item->refresh();
    }

    /**
     * Increment item quantity
     */
    public function incrementQuantity(CartItem $item, int $amount = 1): CartItem
    {
        $item->increment('quantity', $amount);
        return $item->refresh();
    }

    /**
     * Remove item from cart
     */
    public function removeItem(CartItem $item): bool
    {
        return (bool) $item->delete();
    }

    /**
     * Get all items for cart
     */
    public function getItemsForCart(int $cartId): Collection
    {
        return $this->model
            ->where('cart_id', $cartId)
            ->with(['product.photos', 'variant'])
            ->get();
    }
}
