<?php

namespace App\Interfaces\Services\Cart;

use App\Core\ServiceResponse;
use App\Models\Cart;
use App\Models\User;

interface CartCouponManagerInterface
{
    public function applyCoupon(Cart $cart, string $code, ?User $user): ServiceResponse;
    public function validateCoupon(string $code, float $subtotal, ?int $userId): array;
}
