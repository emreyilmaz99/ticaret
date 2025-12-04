<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Repositories\Interfaces\CartRepositoryInterface;

class CartRepository extends EloquentBaseRepository implements CartRepositoryInterface
{
    public function __construct(Cart $model)
    {
        parent::__construct($model);
    }

    /**
     * Find cart by user ID
     */
    public function findByUserId(int $userId): ?Cart
    {
        return $this->model->where('user_id', $userId)->first();
    }

    /**
     * Find cart by session ID
     */
    public function findBySessionId(string $sessionId): ?Cart
    {
        return $this->model->where('session_id', $sessionId)->first();
    }

    /**
     * Get or create cart for user
     */
    public function getOrCreateForUser(int $userId): Cart
    {
        return $this->model->firstOrCreate(['user_id' => $userId]);
    }

    /**
     * Get or create cart for guest (session)
     */
    public function getOrCreateForSession(string $sessionId): Cart
    {
        return $this->model->firstOrCreate(['session_id' => $sessionId]);
    }

    /**
     * Get cart with items loaded
     */
    public function getWithItems(Cart $cart): Cart
    {
        return $cart->load(['items.product.photos', 'items.variant']);
    }

    /**
     * Clear all items from cart
     */
    public function clearItems(Cart $cart): void
    {
        $cart->items()->delete();
    }

    /**
     * Update cart coupon
     */
    public function updateCoupon(Cart $cart, ?string $couponCode, float $discountAmount): Cart
    {
        $cart->update([
            'coupon_code' => $couponCode,
            'discount_amount' => $discountAmount,
        ]);
        return $cart->refresh();
    }

    /**
     * Merge guest cart into user cart
     */
    public function mergeGuestCartToUser(string $sessionId, int $userId): ?Cart
    {
        $guestCart = $this->findBySessionId($sessionId);
        
        if (!$guestCart || $guestCart->items()->count() === 0) {
            return $this->findByUserId($userId);
        }

        $guestCart->mergeWithUserCart($userId);
        
        return $this->findByUserId($userId);
    }
}
