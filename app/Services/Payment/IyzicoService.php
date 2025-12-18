<?php

namespace App\Services\Payment;

use App\Interfaces\Services\Payment\IyzicoServiceInterface;
use App\Interfaces\Services\Payment\IyzicoSubMerchantServiceInterface;
use App\Interfaces\Services\Payment\IyzicoCheckoutServiceInterface;
use App\Interfaces\Services\Payment\IyzicoUtilityServiceInterface;
use App\Services\BaseService;
use App\Models\Vendor;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;

/**
 * IyzicoService (Facade)
 * 
 * Main entry point for iyzico operations.
 * Delegates to specialized sub-services in app/Services/Payment/
 * 
 * @deprecated Use IyzicoSubMerchantService, IyzicoCheckoutService, or IyzicoUtilityService directly
 */
class IyzicoService extends BaseService implements IyzicoServiceInterface
{
    protected IyzicoSubMerchantServiceInterface $subMerchantService;
    protected IyzicoCheckoutServiceInterface $checkoutService;
    protected IyzicoUtilityServiceInterface $utilityService;

    public function __construct(
        IyzicoSubMerchantServiceInterface $subMerchantService,
        IyzicoCheckoutServiceInterface $checkoutService,
        IyzicoUtilityServiceInterface $utilityService
    ) {
        $this->subMerchantService = $subMerchantService;
        $this->checkoutService = $checkoutService;
        $this->utilityService = $utilityService;
    }

    // ==================== SUBMERCHANT OPERATIONS ====================

    /**
     * Create SubMerchant on iyzico
     * @deprecated Use IyzicoSubMerchantService::createSubMerchant()
     */
    public function createSubMerchant(Vendor $vendor)
    {
        return $this->subMerchantService->createSubMerchant($vendor);
    }

    /**
     * Update SubMerchant on iyzico
     * @deprecated Use IyzicoSubMerchantService::updateSubMerchant()
     */
    public function updateSubMerchant(Vendor $vendor)
    {
        return $this->subMerchantService->updateSubMerchant($vendor);
    }

    /**
     * Retrieve SubMerchant from iyzico
     * @deprecated Use IyzicoSubMerchantService::retrieveSubMerchant()
     */
    public function retrieveSubMerchant(Vendor $vendor)
    {
        return $this->subMerchantService->retrieveSubMerchant($vendor);
    }

    /**
     * Ensure vendor is registered as SubMerchant
     * @deprecated Use IyzicoSubMerchantService::ensureSubMerchantRegistered()
     */
    public function ensureSubMerchantRegistered(Vendor $vendor)
    {
        return $this->subMerchantService->ensureSubMerchantRegistered($vendor);
    }

    // ==================== CHECKOUT OPERATIONS ====================

    /**
     * Initialize Checkout Form
     * @deprecated Use IyzicoCheckoutService::initializeCheckoutForm()
     */
    public function initializeCheckoutForm(Order $order, User $user, UserAddress $shippingAddress, array $basketItems): \App\Core\ServiceResponse
    {
        return $this->checkoutService->initializeCheckoutForm($order, $user, $shippingAddress, $basketItems);
    }

    /**
     * Retrieve Checkout Form Result
     * @deprecated Use IyzicoCheckoutService::retrieveCheckoutForm()
     */
    public function retrieveCheckoutForm(string $token): \App\Core\ServiceResponse
    {
        return $this->checkoutService->retrieveCheckoutForm($token);
    }

    /**
     * Build BasketItem for a single order item
     * @deprecated Use IyzicoCheckoutService::buildBasketItem()
     */
    public function buildBasketItem(array $item)
    {
        return $this->checkoutService->buildBasketItem($item);
    }
}
