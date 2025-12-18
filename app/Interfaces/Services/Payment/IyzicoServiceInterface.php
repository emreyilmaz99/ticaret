<?php

namespace App\Interfaces\Services\Payment;

use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Vendor;

interface IyzicoServiceInterface
{
    /**
     * Create sub merchant
     */
    public function createSubMerchant(Vendor $vendor);

    /**
     * Update sub merchant
     */
    public function updateSubMerchant(Vendor $vendor);

    /**
     * Retrieve sub merchant
     */
    public function retrieveSubMerchant(Vendor $vendor);

    /**
     * Ensure sub merchant is registered
     */
    public function ensureSubMerchantRegistered(Vendor $vendor);

    /**
     * Initialize checkout form
     */
    public function initializeCheckoutForm(
        Order $order,
        User $user,
        UserAddress $shippingAddress,
        array $basketItems
    );

    /**
     * Retrieve checkout form
     */
    public function retrieveCheckoutForm(string $token);

    /**
     * Build basket item
     */
    public function buildBasketItem(array $item);
}
