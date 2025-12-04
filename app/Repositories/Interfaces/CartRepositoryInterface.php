<?php

namespace App\Repositories\Interfaces;

use App\Models\Cart;
use App\Models\User;
use App\Repositories\BaseRepositoryInterface;

interface CartRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find cart by user ID
     */
    public function findByUserId(int $userId): ?Cart;

    /**
     * Find cart by session ID
     */
    public function findBySessionId(string $sessionId): ?Cart;

    /**
     * Get or create cart for user
     */
    public function getOrCreateForUser(int $userId): Cart;

    /**
     * Get or create cart for guest (session)
     */
    public function getOrCreateForSession(string $sessionId): Cart;

    /**
     * Get cart with items loaded
     */
    public function getWithItems(Cart $cart): Cart;

    /**
     * Clear all items from cart
     */
    public function clearItems(Cart $cart): void;

    /**
     * Update cart coupon
     */
    public function updateCoupon(Cart $cart, ?string $couponCode, float $discountAmount): Cart;

    /**
     * Merge guest cart into user cart
     */
    public function mergeGuestCartToUser(string $sessionId, int $userId): ?Cart;
}
