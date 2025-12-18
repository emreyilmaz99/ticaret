<?php

namespace App\Interfaces\Services\Order;

use App\Models\Order;

interface OrderPaymentServiceInterface
{
    /**
     * Process payment success
     */
    public function processPaymentSuccess(Order $order, array $data);
}
