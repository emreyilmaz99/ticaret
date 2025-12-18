<?php

namespace App\Interfaces\Services\Order;

use App\Models\Cart;
use App\Models\User;
use App\Models\UserAddress;

interface OrderCreationServiceInterface
{
    /**
     * Create order from cart
     */
    public function createOrderFromCart(
        User $user,
        Cart $cart,
        UserAddress $shippingAddress,
        ?UserAddress $billingAddress
    );
}
