<?php

namespace App\Services\Payment;

use App\Interfaces\Services\Payment\IyzicoCheckoutServiceInterface;
use App\Interfaces\Services\Payment\IyzicoUtilityServiceInterface;
use App\Services\BaseService;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;
use Iyzipay\Model\Locale;
use Iyzipay\Model\Currency;
use Iyzipay\Model\CheckoutFormInitialize;
use Iyzipay\Model\CheckoutForm;
use Iyzipay\Model\BasketItemType;
use Iyzipay\Model\PaymentGroup;
use Iyzipay\Model\Address;
use Iyzipay\Model\BasketItem;
use Iyzipay\Model\Buyer;
use Iyzipay\Options;
use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
use Iyzipay\Request\RetrieveCheckoutFormRequest;
use Illuminate\Support\Facades\Log;

/**
 * IyzicoCheckoutService
 * 
 * Handles iyzico Checkout Form operations:
 * - Initialize payment
 * - Retrieve payment result
 * - Build buyer, address, basket items
 */
class IyzicoCheckoutService extends BaseService implements IyzicoCheckoutServiceInterface
{
    protected Options $options;
    protected IyzicoUtilityServiceInterface $utility;

    public function __construct(IyzicoUtilityServiceInterface $utility)
    {
        $this->utility = $utility;
        $this->options = new Options();
        $this->options->setApiKey(config('iyzico.api_key'));
        $this->options->setSecretKey(config('iyzico.secret_key'));
        $this->options->setBaseUrl(config('iyzico.base_url'));
    }

    /**
     * Initialize Checkout Form
     */
    public function initializeCheckoutForm(Order $order, User $user, UserAddress $shippingAddress, array $basketItems)
    {
        try {
            $request = new CreateCheckoutFormInitializeRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($order->iyzico_conversation_id ?? $this->utility->generateConversationId());
            $request->setPrice($this->utility->formatPrice((float) $order->subtotal));
            $request->setPaidPrice($this->utility->formatPrice((float) $order->total));
            $request->setCurrency(Currency::TL);
            $request->setBasketId($order->order_number);
            $request->setPaymentGroup(PaymentGroup::PRODUCT);
            $request->setCallbackUrl(config('iyzico.callback_url'));
            $request->setEnabledInstallments([1, 2, 3, 6, 9, 12]);

            $buyer = $this->buildBuyer($user, $shippingAddress);
            $request->setBuyer($buyer);

            $shippingAddr = $this->buildAddress($shippingAddress, 'shipping');
            $request->setShippingAddress($shippingAddr);

            $billingAddr = $this->buildAddress($shippingAddress, 'billing');
            $request->setBillingAddress($billingAddr);

            $request->setBasketItems($basketItems);

            Log::info('iyzico CheckoutForm Initialize Request', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'price' => $order->subtotal,
                'paid_price' => $order->total,
                'basket_count' => count($basketItems),
            ]);

            $checkoutFormInit = CheckoutFormInitialize::create($request, $this->options);

            if ($checkoutFormInit->getStatus() === 'success') {
                Log::info('iyzico CheckoutForm Initialize Success', [
                    'order_id' => $order->id,
                    'token' => $checkoutFormInit->getToken(),
                ]);

                return $this->successResponse([
                    'token' => $checkoutFormInit->getToken(),
                    'checkoutFormContent' => $checkoutFormInit->getCheckoutFormContent(),
                    'paymentPageUrl' => $checkoutFormInit->getPaymentPageUrl(),
                    'tokenExpireTime' => $checkoutFormInit->getTokenExpireTime(),
                ], 'Checkout Form başlatıldı');
            }

            Log::error('iyzico CheckoutForm Initialize Failed', [
                'order_id' => $order->id,
                'error_code' => $checkoutFormInit->getErrorCode(),
                'error_message' => $checkoutFormInit->getErrorMessage(),
            ]);

            return $this->errorResponse(
                'Ödeme başlatılamadı: ' . $checkoutFormInit->getErrorMessage(),
                400
            );

        } catch (\Exception $e) {
            Log::error('iyzico CheckoutForm Initialize Exception', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return $this->errorResponse('iyzico bağlantı hatası: ' . $e->getMessage());
        }
    }

    /**
     * Retrieve Checkout Form Result
     */
    public function retrieveCheckoutForm(string $token)
    {
        try {
            $request = new RetrieveCheckoutFormRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($this->utility->generateConversationId());
            $request->setToken($token);

            $checkoutForm = CheckoutForm::retrieve($request, $this->options);

            Log::info('iyzico CheckoutForm Retrieve', [
                'token' => $token,
                'status' => $checkoutForm->getStatus(),
                'payment_status' => $checkoutForm->getPaymentStatus(),
            ]);

            if ($checkoutForm->getStatus() === 'success') {
                $paymentStatus = $checkoutForm->getPaymentStatus();
                
                if ($paymentStatus === 'SUCCESS') {
                    return $this->successResponse([
                        'payment_id' => $checkoutForm->getPaymentId(),
                        'payment_status' => $paymentStatus,
                        'price' => $checkoutForm->getPrice(),
                        'paid_price' => $checkoutForm->getPaidPrice(),
                        'installment' => $checkoutForm->getInstallment(),
                        'fraud_status' => $checkoutForm->getFraudStatus(),
                        'card_type' => $checkoutForm->getCardType(),
                        'card_association' => $checkoutForm->getCardAssociation(),
                        'card_family' => $checkoutForm->getCardFamily(),
                        'bin_number' => $checkoutForm->getBinNumber(),
                        'last_four_digits' => $checkoutForm->getLastFourDigits(),
                        'basket_id' => $checkoutForm->getBasketId(),
                        'payment_items' => $checkoutForm->getPaymentItems(),
                        'raw_result' => json_decode(json_encode($checkoutForm), true),
                    ], 'Ödeme başarılı');
                }

                return $this->errorResponse('Ödeme başarısız: ' . $paymentStatus, 400);
            }

            return $this->errorResponse(
                'Ödeme sorgulanamadı: ' . $checkoutForm->getErrorMessage(),
                400
            );

        } catch (\Exception $e) {
            Log::error('iyzico CheckoutForm Retrieve Exception', [
                'token' => $token,
                'error' => $e->getMessage(),
            ]);

            return $this->errorResponse('iyzico bağlantı hatası: ' . $e->getMessage());
        }
    }

    /**
     * Build Buyer object
     */
    public function buildBuyer(User $user, UserAddress $address): Buyer
    {
        $buyer = new Buyer();
        $buyer->setId((string) $user->id);
        $buyer->setName($this->utility->getFirstName($address->full_name ?? $user->name));
        $buyer->setSurname($this->utility->getLastName($address->full_name ?? $user->name));
        $buyer->setGsmNumber($this->utility->formatPhoneNumber($address->phone ?? $user->phone));
        $buyer->setEmail($user->email);
        $buyer->setIdentityNumber($user->identity_number ?? '11111111111');
        $buyer->setRegistrationAddress($this->utility->sanitizeAddress($address->address_line));
        $buyer->setCity($this->utility->sanitizeCity($address->city));
        $buyer->setCountry($address->country ?? 'Turkey');
        $buyer->setIp(request()->ip() ?? '127.0.0.1');

        return $buyer;
    }

    /**
     * Build Address object
     */
    public function buildAddress(UserAddress $address, string $type = 'shipping'): Address
    {
        $iyziAddress = new Address();
        $iyziAddress->setContactName($address->full_name);
        $iyziAddress->setCity($this->utility->sanitizeCity($address->city));
        $iyziAddress->setCountry($address->country ?? 'Turkey');
        
        $addressLine = $address->address_line;
        if ($address->district) {
            $addressLine = $address->district . ', ' . $addressLine;
        }
        if ($address->neighborhood) {
            $addressLine = $address->neighborhood . ', ' . $addressLine;
        }
        
        $iyziAddress->setAddress($this->utility->sanitizeAddress($addressLine));

        return $iyziAddress;
    }

    /**
     * Build BasketItem for a single order item
     */
    public function buildBasketItem(array $item): BasketItem
    {
        $basketItem = new BasketItem();
        $basketItem->setId($item['id']);
        $basketItem->setName($item['name']);
        $basketItem->setCategory1($item['category'] ?? 'Genel');
        $basketItem->setItemType(BasketItemType::PHYSICAL);
        $basketItem->setPrice($this->utility->formatPrice($item['price']));

        if (!empty($item['submerchant_key'])) {
            $basketItem->setSubMerchantKey($item['submerchant_key']);
            $basketItem->setSubMerchantPrice($this->utility->formatPrice($item['submerchant_price']));
        }

        return $basketItem;
    }
}
