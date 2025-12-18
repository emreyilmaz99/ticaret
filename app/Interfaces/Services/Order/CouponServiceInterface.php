<?php

namespace App\Interfaces\Services\Order;

use App\Models\Order;
use App\Models\VendorCoupon;

interface CouponServiceInterface
{
    /**
     * Record coupon usage for order
     */
    public function recordUsageForOrder(Order $order): void;

    /**
     * Validate coupon
     */
    public function validateCoupon(string $code, ?int $userId = null, float $subtotal = 0): array;

    /**
     * Calculate discount
     */
    public function calculateDiscount(VendorCoupon $coupon, float $subtotal): float;

    /**
     * Get coupon by code
     */
    public function getCouponByCode(string $code): ?VendorCoupon;
}
