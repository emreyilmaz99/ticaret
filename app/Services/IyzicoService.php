<?php

namespace App\Services;

use App\Models\Vendor;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;
use Iyzipay\Model\Locale;
use Iyzipay\Model\Currency;
use Iyzipay\Model\SubMerchant;
use Iyzipay\Model\SubMerchantType;
use Iyzipay\Model\CheckoutFormInitialize;
use Iyzipay\Model\CheckoutForm;
use Iyzipay\Model\BasketItemType;
use Iyzipay\Model\PaymentGroup;
use Iyzipay\Model\Address;
use Iyzipay\Model\BasketItem;
use Iyzipay\Model\Buyer;
use Iyzipay\Options;
use Iyzipay\Request\CreateSubMerchantRequest;
use Iyzipay\Request\UpdateSubMerchantRequest;
use Iyzipay\Request\RetrieveSubMerchantRequest;
use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
use Iyzipay\Request\RetrieveCheckoutFormRequest;
use Illuminate\Support\Facades\Log;

class IyzicoService extends BaseService
{
    protected Options $options;

    public function __construct()
    {
        $this->options = new Options();
        $this->options->setApiKey(config('iyzico.api_key'));
        $this->options->setSecretKey(config('iyzico.secret_key'));
        $this->options->setBaseUrl(config('iyzico.base_url'));
    }

    /**
     * Generate unique conversation ID for API calls
     */
    protected function generateConversationId(): string
    {
        return config('iyzico.conversation_prefix') . uniqid() . '_' . time();
    }

    /**
     * Get iyzico SubMerchant type from vendor merchant_type
     */
    protected function getSubMerchantType(string $merchantType): string
    {
        return match ($merchantType) {
            'personal' => SubMerchantType::PERSONAL,
            'private_company' => SubMerchantType::PRIVATE_COMPANY,
            'limited_company' => SubMerchantType::LIMITED_OR_JOINT_STOCK_COMPANY,
            default => SubMerchantType::PERSONAL,
        };
    }

    /**
     * Get vendor's primary IBAN
     */
    protected function getVendorIban(Vendor $vendor): ?string
    {
        $bankAccount = $vendor->bankAccounts()->where('is_primary', true)->first();
        $iban = $bankAccount?->iban;
        
        if ($iban) {
            // Format IBAN - remove spaces and ensure uppercase
            $iban = strtoupper(preg_replace('/\s+/', '', $iban));
        }
        
        return $iban;
    }

    /**
     * Validate IBAN format for Turkish banks
     * Turkish IBAN: TR + 2 check digits + 5 bank code + 1 reserved + 16 account number = 26 chars
     */
    protected function validateIban(?string $iban): bool
    {
        if (empty($iban)) {
            return false;
        }
        
        // Remove spaces and make uppercase
        $iban = strtoupper(preg_replace('/\s+/', '', $iban));
        
        // Turkish IBAN must be exactly 26 characters: TR + 24 digits
        return strlen($iban) === 26 && preg_match('/^TR\d{24}$/', $iban);
    }

    /**
     * Get vendor's primary address as string
     */
    protected function getVendorAddress(Vendor $vendor): ?string
    {
        $address = $vendor->addresses()->where('is_primary', true)->first();
        if (!$address) {
            return null;
        }

        $parts = array_filter([
            $address->address_line,
            $address->city,
            $address->country,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Register vendor as SubMerchant on iyzico
     */
    public function createSubMerchant(Vendor $vendor)
    {
        try {
            // Validate required fields
            if (empty($vendor->merchant_type)) {
                return $this->errorResponse('Satıcı türü belirtilmemiş', 400);
            }

            $iban = $this->getVendorIban($vendor);
            if (empty($iban)) {
                return $this->errorResponse('IBAN bilgisi bulunamadı', 400);
            }
            
            // Validate IBAN format
            if (!$this->validateIban($iban)) {
                return $this->errorResponse('IBAN formatı geçersiz. TR ile başlamalı ve 26 karakter olmalı (örn: TR320001004014812790615007)', 400);
            }

            $address = $this->getVendorAddress($vendor);
            if (empty($address)) {
                return $this->errorResponse('Adres bilgisi bulunamadı', 400);
            }

            // Create request
            $request = new CreateSubMerchantRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($this->generateConversationId());
            $request->setSubMerchantExternalId((string) $vendor->id);
            $request->setSubMerchantType($this->getSubMerchantType($vendor->merchant_type));
            $request->setAddress($address);
            $request->setEmail($vendor->email);
            $request->setGsmNumber($this->formatPhoneNumber($vendor->phone));
            $request->setName($vendor->company_name ?? $vendor->name);
            $request->setIban($iban);
            $request->setCurrency(Currency::TL);

            // Set type-specific fields
            switch ($vendor->merchant_type) {
                case 'personal':
                    // Bireysel satıcı: TC Kimlik ve iletişim kişisi zorunlu
                    if (empty($vendor->identity_number)) {
                        return $this->errorResponse('TC Kimlik numarası gereklidir', 400);
                    }
                    $request->setIdentityNumber($vendor->identity_number);
                    $request->setContactName($vendor->contact_name ?? '');
                    $request->setContactSurname($vendor->contact_surname ?? '');
                    break;

                case 'private_company':
                    // Şahıs şirketi: TC Kimlik, vergi dairesi ve yasal ünvan zorunlu
                    if (empty($vendor->identity_number)) {
                        return $this->errorResponse('TC Kimlik numarası gereklidir', 400);
                    }
                    if (empty($vendor->tax_office) || empty($vendor->legal_company_title)) {
                        return $this->errorResponse('Vergi dairesi ve yasal şirket ünvanı gereklidir', 400);
                    }
                    $request->setIdentityNumber($vendor->identity_number);
                    $request->setTaxOffice($vendor->tax_office);
                    $request->setLegalCompanyTitle($vendor->legal_company_title);
                    break;

                case 'limited_company':
                    // Limited/Anonim: Vergi no, vergi dairesi ve yasal ünvan zorunlu
                    if (empty($vendor->tax_id)) {
                        return $this->errorResponse('Vergi numarası gereklidir', 400);
                    }
                    if (empty($vendor->tax_office) || empty($vendor->legal_company_title)) {
                        return $this->errorResponse('Vergi dairesi ve yasal şirket ünvanı gereklidir', 400);
                    }
                    $request->setTaxNumber($vendor->tax_id);
                    $request->setTaxOffice($vendor->tax_office);
                    $request->setLegalCompanyTitle($vendor->legal_company_title);
                    break;
            }

            // Log request data for debugging
            Log::info('iyzico SubMerchant create request', [
                'vendor_id' => $vendor->id,
                'merchant_type' => $vendor->merchant_type,
                'iyzico_type' => $this->getSubMerchantType($vendor->merchant_type),
                'email' => $vendor->email,
                'phone' => $this->formatPhoneNumber($vendor->phone),
                'name' => $vendor->company_name ?? $vendor->name,
                'iban' => $iban,
                'address' => $address,
                'identity_number' => $vendor->identity_number ?? null,
                'tax_id' => $vendor->tax_id ?? null,
                'tax_office' => $vendor->tax_office ?? null,
            ]);

            // Make API call
            $subMerchant = SubMerchant::create($request, $this->options);

            // Log the full response for debugging
            Log::info('iyzico SubMerchant create response', [
                'vendor_id' => $vendor->id,
                'status' => $subMerchant->getStatus(),
                'error_code' => $subMerchant->getErrorCode(),
                'error_message' => $subMerchant->getErrorMessage(),
                'raw_result' => $subMerchant->getRawResult(),
                'conversation_id' => $subMerchant->getConversationId(),
            ]);

            // Check response
            if ($subMerchant->getStatus() === 'success') {
                // Update vendor with subMerchant key
                $vendor->update([
                    'iyzico_submerchant_key' => $subMerchant->getSubMerchantKey(),
                    'iyzico_status' => 'active',
                    'iyzico_registered_at' => now(),
                ]);

                return $this->successResponse([
                    'submerchant_key' => $subMerchant->getSubMerchantKey(),
                    'status' => 'active',
                ], 'SubMerchant başarıyla oluşturuldu');
            }

            // Handle error
            $vendor->update([
                'iyzico_status' => 'rejected',
            ]);

            return $this->errorResponse(
                'iyzico SubMerchant oluşturulamadı: ' . $subMerchant->getErrorMessage(),
                400,
                [
                    'error_code' => $subMerchant->getErrorCode(),
                    'error_group' => $subMerchant->getErrorGroup(),
                ]
            );

        } catch (\Exception $e) {
            Log::error('iyzico SubMerchant create exception', [
                'vendor_id' => $vendor->id,
                'error' => $e->getMessage(),
            ]);

            return $this->errorResponse('iyzico bağlantı hatası: ' . $e->getMessage());
        }
    }

    /**
     * Update SubMerchant on iyzico
     */
    public function updateSubMerchant(Vendor $vendor)
    {
        try {
            if (empty($vendor->iyzico_submerchant_key)) {
                return $this->errorResponse('Satıcı henüz iyzico\'ya kayıtlı değil', 400);
            }

            $iban = $this->getVendorIban($vendor);
            $address = $this->getVendorAddress($vendor);

            $request = new UpdateSubMerchantRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($this->generateConversationId());
            $request->setSubMerchantKey($vendor->iyzico_submerchant_key);
            
            if ($address) {
                $request->setAddress($address);
            }
            
            $request->setEmail($vendor->email);
            $request->setGsmNumber($this->formatPhoneNumber($vendor->phone));
            $request->setName($vendor->company_name ?? $vendor->name);
            
            if ($iban) {
                $request->setIban($iban);
            }
            
            $request->setCurrency(Currency::TL);

            // Set type-specific fields based on merchant type
            if ($vendor->merchant_type === 'personal') {
                if ($vendor->identity_number) {
                    $request->setIdentityNumber($vendor->identity_number);
                }
                if ($vendor->contact_name) {
                    $request->setContactName($vendor->contact_name);
                }
                if ($vendor->contact_surname) {
                    $request->setContactSurname($vendor->contact_surname);
                }
            } elseif ($vendor->merchant_type === 'private_company') {
                if ($vendor->identity_number) {
                    $request->setIdentityNumber($vendor->identity_number);
                }
                if ($vendor->tax_office) {
                    $request->setTaxOffice($vendor->tax_office);
                }
                if ($vendor->legal_company_title) {
                    $request->setLegalCompanyTitle($vendor->legal_company_title);
                }
            } elseif ($vendor->merchant_type === 'limited_company') {
                if ($vendor->tax_id) {
                    $request->setTaxNumber($vendor->tax_id);
                }
                if ($vendor->tax_office) {
                    $request->setTaxOffice($vendor->tax_office);
                }
                if ($vendor->legal_company_title) {
                    $request->setLegalCompanyTitle($vendor->legal_company_title);
                }
            }

            // Make API call
            $subMerchant = SubMerchant::update($request, $this->options);

            Log::info('iyzico SubMerchant update response', [
                'vendor_id' => $vendor->id,
                'status' => $subMerchant->getStatus(),
            ]);

            if ($subMerchant->getStatus() === 'success') {
                return $this->successResponse([
                    'submerchant_key' => $vendor->iyzico_submerchant_key,
                ], 'SubMerchant başarıyla güncellendi');
            }

            return $this->errorResponse(
                'iyzico SubMerchant güncellenemedi: ' . $subMerchant->getErrorMessage(),
                400
            );

        } catch (\Exception $e) {
            Log::error('iyzico SubMerchant update exception', [
                'vendor_id' => $vendor->id,
                'error' => $e->getMessage(),
            ]);

            return $this->errorResponse('iyzico bağlantı hatası: ' . $e->getMessage());
        }
    }

    /**
     * Retrieve SubMerchant from iyzico
     */
    public function retrieveSubMerchant(Vendor $vendor)
    {
        try {
            $request = new RetrieveSubMerchantRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($this->generateConversationId());
            $request->setSubMerchantExternalId((string) $vendor->id);

            $subMerchant = SubMerchant::retrieve($request, $this->options);

            if ($subMerchant->getStatus() === 'success') {
                return $this->successResponse([
                    'name' => $subMerchant->getName(),
                    'email' => $subMerchant->getEmail(),
                    'gsm_number' => $subMerchant->getGsmNumber(),
                    'address' => $subMerchant->getAddress(),
                    'iban' => $subMerchant->getIban(),
                    'submerchant_key' => $subMerchant->getSubMerchantKey(),
                    'submerchant_type' => $subMerchant->getSubMerchantType(),
                ], 'SubMerchant bilgileri alındı');
            }

            return $this->errorResponse(
                'SubMerchant bulunamadı: ' . $subMerchant->getErrorMessage(),
                404
            );

        } catch (\Exception $e) {
            return $this->errorResponse('iyzico bağlantı hatası: ' . $e->getMessage());
        }
    }

    /**
     * Format phone number for iyzico (must start with +90)
     */
    protected function formatPhoneNumber(?string $phone): string
    {
        if (empty($phone)) {
            return '+905000000000'; // Default fallback
        }

        // Remove all non-numeric characters
        $phone = preg_replace('/\D/', '', $phone);

        // If starts with 0, remove it
        if (str_starts_with($phone, '0')) {
            $phone = substr($phone, 1);
        }

        // If starts with 90, add +
        if (str_starts_with($phone, '90')) {
            return '+' . $phone;
        }

        // Otherwise, add +90
        return '+90' . $phone;
    }

    /**
     * Register vendor as SubMerchant if not already registered
     * Called when vendor is approved
     */
    public function ensureSubMerchantRegistered(Vendor $vendor)
    {
        // Skip if marketplace is disabled
        if (!config('iyzico.marketplace_enabled')) {
            return $this->successResponse(null, 'Marketplace devre dışı');
        }

        // Skip if already registered
        if ($vendor->iyzico_status === 'active' && !empty($vendor->iyzico_submerchant_key)) {
            return $this->successResponse([
                'submerchant_key' => $vendor->iyzico_submerchant_key,
            ], 'SubMerchant zaten kayıtlı');
        }

        // Create new SubMerchant
        return $this->createSubMerchant($vendor);
    }

    // ==================== CHECKOUT FORM METHODS ====================

    /**
     * Initialize Checkout Form (CF Başlatma)
     * 
     * @param Order $order Sipariş
     * @param User $user Kullanıcı
     * @param UserAddress $shippingAddress Teslimat adresi
     * @param array $basketItems Sepet kalemleri
     * @return \App\Core\ServiceResponse
     */
    public function initializeCheckoutForm(Order $order, User $user, UserAddress $shippingAddress, array $basketItems)
    {
        try {
            $request = new CreateCheckoutFormInitializeRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($order->iyzico_conversation_id ?? $this->generateConversationId());
            $request->setPrice(number_format($order->subtotal, 2, '.', ''));
            $request->setPaidPrice(number_format($order->total, 2, '.', ''));
            $request->setCurrency(Currency::TL);
            $request->setBasketId($order->order_number);
            $request->setPaymentGroup(PaymentGroup::PRODUCT);
            $request->setCallbackUrl(config('iyzico.callback_url'));
            $request->setEnabledInstallments([1, 2, 3, 6, 9, 12]);

            // Buyer
            $buyer = $this->buildBuyer($user, $shippingAddress);
            $request->setBuyer($buyer);

            // Shipping Address
            $shippingAddr = $this->buildAddress($shippingAddress, 'shipping');
            $request->setShippingAddress($shippingAddr);

            // Billing Address (same as shipping if not provided)
            $billingAddr = $this->buildAddress($shippingAddress, 'billing');
            $request->setBillingAddress($billingAddr);

            // Basket Items
            $request->setBasketItems($basketItems);

            Log::info('iyzico CheckoutForm Initialize Request', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'price' => $order->subtotal,
                'paid_price' => $order->total,
                'basket_count' => count($basketItems),
            ]);

            // API Call
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
     * Retrieve Checkout Form Result (CF Sorgulama)
     * 
     * @param string $token CF token
     * @return \App\Core\ServiceResponse
     */
    public function retrieveCheckoutForm(string $token)
    {
        try {
            $request = new RetrieveCheckoutFormRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($this->generateConversationId());
            $request->setToken($token);

            $checkoutForm = CheckoutForm::retrieve($request, $this->options);

            Log::info('iyzico CheckoutForm Retrieve', [
                'token' => $token,
                'status' => $checkoutForm->getStatus(),
                'payment_status' => $checkoutForm->getPaymentStatus(),
            ]);

            if ($checkoutForm->getStatus() === 'success') {
                $paymentStatus = $checkoutForm->getPaymentStatus();
                
                // SUCCESS = Ödeme başarılı
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

                // FAILURE = Ödeme başarısız
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
     * Build Buyer object for iyzico
     */
    protected function buildBuyer(User $user, UserAddress $address): Buyer
    {
        $buyer = new Buyer();
        $buyer->setId((string) $user->id);
        $buyer->setName($this->getFirstName($address->full_name ?? $user->name));
        $buyer->setSurname($this->getLastName($address->full_name ?? $user->name));
        $buyer->setGsmNumber($this->formatPhoneNumber($address->phone ?? $user->phone));
        $buyer->setEmail($user->email);
        $buyer->setIdentityNumber($user->identity_number ?? '11111111111'); // TC Kimlik
        $buyer->setRegistrationAddress($address->address_line);
        $buyer->setCity($address->city);
        $buyer->setCountry($address->country ?? 'Turkey');
        $buyer->setIp(request()->ip() ?? '127.0.0.1');

        return $buyer;
    }

    /**
     * Build Address object for iyzico
     */
    protected function buildAddress(UserAddress $address, string $type = 'shipping'): Address
    {
        $iyziAddress = new Address();
        $iyziAddress->setContactName($address->full_name);
        $iyziAddress->setCity($address->city);
        $iyziAddress->setCountry($address->country ?? 'Turkey');
        
        // Adres satırı oluştur
        $addressLine = $address->address_line;
        if ($address->district) {
            $addressLine = $address->district . ', ' . $addressLine;
        }
        if ($address->neighborhood) {
            $addressLine = $address->neighborhood . ', ' . $addressLine;
        }
        $iyziAddress->setAddress($addressLine);

        return $iyziAddress;
    }

    /**
     * Build BasketItem for a single order item
     * 
     * @param array $item Order item data
     * @return BasketItem
     */
    public function buildBasketItem(array $item): BasketItem
    {
        $basketItem = new BasketItem();
        $basketItem->setId($item['id']);
        $basketItem->setName($item['name']);
        $basketItem->setCategory1($item['category'] ?? 'Genel');
        $basketItem->setItemType(BasketItemType::PHYSICAL);
        $basketItem->setPrice(number_format($item['price'], 2, '.', ''));

        // Marketplace: SubMerchant bilgileri
        if (!empty($item['submerchant_key'])) {
            $basketItem->setSubMerchantKey($item['submerchant_key']);
            $basketItem->setSubMerchantPrice(number_format($item['submerchant_price'], 2, '.', ''));
        }

        return $basketItem;
    }

    /**
     * Get first name from full name
     */
    protected function getFirstName(string $fullName): string
    {
        $parts = explode(' ', trim($fullName));
        return $parts[0] ?? 'Ad';
    }

    /**
     * Get last name from full name
     */
    protected function getLastName(string $fullName): string
    {
        $parts = explode(' ', trim($fullName));
        array_shift($parts);
        return implode(' ', $parts) ?: 'Soyad';
    }
}
