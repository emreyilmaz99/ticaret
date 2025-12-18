<?php

namespace App\Interfaces\Services\Order;

use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;

interface CheckoutServiceInterface
{
    /**
     * Validate cart
     */
    public function validateCart(Cart $cart);

    /**
     * Create order from cart
     */
    public function createOrderFromCart(
        User $user,
        Cart $cart,
        UserAddress $shippingAddress,
        ?UserAddress $billingAddress
    );

    /**
     * Initialize payment
     */
    public function initializePayment(
        Order $order,
        User $user,
        UserAddress $shippingAddress,
        array $basketItems
    );

    /**
     * Handle payment callback
     */
    public function handlePaymentCallback(string $token);
}
