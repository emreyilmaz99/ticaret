<?php

namespace App\Interfaces\Services\Payment;

use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;
use Iyzipay\Model\Buyer;
use Iyzipay\Model\Address;
use Iyzipay\Model\BasketItem;

interface IyzicoCheckoutServiceInterface
{
    public function initializeCheckoutForm(Order $order, User $user, UserAddress $shippingAddress, array $basketItems);
    public function retrieveCheckoutForm(string $token);
    public function buildBuyer(User $user, UserAddress $address): Buyer;
    public function buildAddress(UserAddress $address, string $type = 'shipping'): Address;
    public function buildBasketItem(array $item): BasketItem;
}
