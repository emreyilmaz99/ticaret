<?php

namespace App\Interfaces\Services\Order;

use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;

interface OrderServiceInterface
{
    /**
     * Validate cart
     */
    public function validateCart(Cart $cart);

    /**
     * Create order from cart
     */
    public function createOrderFromCart(User $user, Cart $cart, UserAddress $shippingAddress, ?UserAddress $billingAddress = null);

    /**
     * Process payment success
     */
    public function processPaymentSuccess(Order $order, $data);

    /**
     * Get user orders
     */
    public function getUserOrders(int $userId, int $perPage = 10);

    /**
     * Get user order
     */
    public function getUserOrder(int $userId, string $orderNumber);

    /**
     * Cancel order
     */
    public function cancelOrder(int $userId, string $orderNumber, string $reason = 'Kullanıcı tarafından iptal edildi');
}
