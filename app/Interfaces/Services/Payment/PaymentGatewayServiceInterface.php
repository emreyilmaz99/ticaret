<?php

namespace App\Interfaces\Services\Payment;

use App\Core\ServiceResponse;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;

interface PaymentGatewayServiceInterface
{
    /**
     * Build basket item
     */
    public function buildBasketItem(array $data);

    /**
     * Initialize checkout form
     */
    public function initializeCheckoutForm(
        Order $order,
        User $user,
        UserAddress $shippingAddress,
        array $basketItems
    ): ServiceResponse;

    /**
     * Retrieve checkout form
     */
    public function retrieveCheckoutForm(string $token): ServiceResponse;
}
