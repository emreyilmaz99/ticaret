<?php

namespace App\Services\Order;

use App\Services\BaseService;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;

/**
 * OrderService (Facade)
 * 
 * Main entry point for order operations.
 * Delegates to specialized sub-services.
 * 
 * @deprecated Use OrderValidationService, OrderCreationService, or OrderPaymentService directly
 */
class OrderService extends BaseService
{
    protected OrderValidationService $validationService;
    protected OrderCreationService $creationService;
    protected OrderPaymentService $paymentService;

    public function __construct(
        OrderValidationService $validationService,
        OrderCreationService $creationService,
        OrderPaymentService $paymentService
    ) {
        $this->validationService = $validationService;
        $this->creationService = $creationService;
        $this->paymentService = $paymentService;
    }

    /**
     * Validate cart before order creation
     * 
     * @deprecated Use OrderValidationService::validateCart() directly
     */
    public function validateCart(Cart $cart)
    {
        return $this->validationService->validateCart($cart);
    }

    /**
     * Create order from cart
     * 
     * @deprecated Use OrderCreationService::createOrderFromCart() directly
     */
    public function createOrderFromCart(User $user, Cart $cart, UserAddress $shippingAddress, ?UserAddress $billingAddress = null)
    {
        return $this->creationService->createOrderFromCart($user, $cart, $shippingAddress, $billingAddress);
    }

    /**
     * Process successful payment
     * 
     * @deprecated Use OrderPaymentService::processPaymentSuccess() directly
     */
    public function processPaymentSuccess(Order $order, $data)
    {
        return $this->paymentService->processPaymentSuccess($order, $data);
    }
}
