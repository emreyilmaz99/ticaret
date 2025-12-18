<?php

namespace App\Interfaces\Services\Order;

use App\Models\Cart;

interface OrderValidationServiceInterface
{
    /**
     * Validate cart before order creation
     */
    public function validateCart(Cart $cart);

    /**
     * Validate vendor payment capability
     */
    public function validateVendorPaymentCapability($vendor): bool;

    /**
     * Validate product availability
     */
    public function validateProductAvailability($product): array;

    /**
     * Validate variant stock
     */
    public function validateStock($variant, int $quantity): array;
}
