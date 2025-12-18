<?php

namespace App\Interfaces\Services\Cart;

use App\Core\ServiceResponse;
use App\Models\User;

interface CartServiceInterface
{
    /**
     * Get cart
     */
    public function getCart(?User $user, ?string $sessionId): ServiceResponse;

    /**
     * Add item to cart
     */
    public function addItem(?User $user, ?string $sessionId, array $data): ServiceResponse;

    /**
     * Update cart item
     */
    public function updateItem(?User $user, ?string $sessionId, int $itemId, int $quantity): ServiceResponse;

    /**
     * Remove item from cart
     */
    public function removeItem(?User $user, ?string $sessionId, int $itemId): ServiceResponse;

    /**
     * Clear cart
     */
    public function clearCart(?User $user, ?string $sessionId): ServiceResponse;

    /**
     * Apply coupon to cart
     */
    public function applyCoupon(?User $user, ?string $sessionId, string $code): ServiceResponse;

    /**
     * Remove coupon from cart
     */
    public function removeCoupon(?User $user, ?string $sessionId): ServiceResponse;

    /**
     * Merge guest cart with user cart
     */
    public function mergeCart(User $user, ?string $sessionId): ServiceResponse;

    /**
     * Clear cart by user ID
     */
    public function clearCartByUserId(int $userId): void;
}
