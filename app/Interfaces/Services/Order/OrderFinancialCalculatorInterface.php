<?php

namespace App\Interfaces\Services\Order;

use App\Models\OrderItem;

interface OrderFinancialCalculatorInterface
{
    /**
     * Calculate financial breakdown for an order item with coupon discount
     */
    public function calculate(
        OrderItem $orderItem, 
        float $totalBeforeDiscount = 0, 
        float $totalCouponDiscount = 0
    ): array;

    /**
     * Calculate total financials for multiple order items
     */
    public function calculateBulk(
        $orderItems,
        float $totalBeforeDiscount = 0,
        float $totalCouponDiscount = 0
    ): array;
}
