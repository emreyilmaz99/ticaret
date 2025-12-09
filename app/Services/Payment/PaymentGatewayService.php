<?php

namespace App\Services\Payment;

use App\Services\Payment\IyzicoService;
use App\Core\ServiceResponse;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;

class PaymentGatewayService
{
    protected IyzicoService $iyzicoService;

    public function __construct(IyzicoService $iyzicoService)
    {
        $this->iyzicoService = $iyzicoService;
    }

    public function buildBasketItem(array $data)
    {
        return $this->iyzicoService->buildBasketItem($data);
    }

    public function initializeCheckoutForm(Order $order, User $user, UserAddress $shippingAddress, array $basketItems): ServiceResponse
    {
        return $this->iyzicoService->initializeCheckoutForm($order, $user, $shippingAddress, $basketItems);
    }

    public function retrieveCheckoutForm(string $token): ServiceResponse
    {
        return $this->iyzicoService->retrieveCheckoutForm($token);
    }

    // expose other gateway related helpers as needed (refund, payment status, etc.)
}
