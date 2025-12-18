<?php

namespace App\Services\Payment;

use App\Interfaces\Services\Payment\IyzicoSubMerchantServiceInterface;
use App\Interfaces\Services\Payment\IyzicoUtilityServiceInterface;
use App\Services\BaseService;
use App\Models\Vendor;
use Iyzipay\Model\Locale;
use Iyzipay\Model\Currency;
use Iyzipay\Model\SubMerchant;
use Iyzipay\Model\SubMerchantType;
use Iyzipay\Options;
use Iyzipay\Request\CreateSubMerchantRequest;
use Iyzipay\Request\UpdateSubMerchantRequest;
use Iyzipay\Request\RetrieveSubMerchantRequest;
use Illuminate\Support\Facades\Log;

/**
 * IyzicoSubMerchantService
 * 
 * Handles iyzico SubMerchant (alt satıcı) operations:
 * - Create, update, retrieve submerchants
 * - Vendor registration management
 */
class IyzicoSubMerchantService extends BaseService implements IyzicoSubMerchantServiceInterface
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
     * Create SubMerchant on iyzico
     */
    public function createSubMerchant(Vendor $vendor)
    {
        try {
            // Validate required fields
            $validation = $this->validateVendorData($vendor);
            if (!$validation['valid']) {
                return $this->errorResponse($validation['message'], 400);
            }

            $request = $this->buildCreateRequest($vendor);

            Log::info('iyzico SubMerchant create request', [
                'vendor_id' => $vendor->id,
                'merchant_type' => $vendor->merchant_type,
                'email' => $vendor->email,
            ]);

            $subMerchant = SubMerchant::create($request, $this->options);

            Log::info('iyzico SubMerchant create response', [
                'vendor_id' => $vendor->id,
                'status' => $subMerchant->getStatus(),
                'error_code' => $subMerchant->getErrorCode(),
                'error_message' => $subMerchant->getErrorMessage(),
            ]);

            if ($subMerchant->getStatus() === 'success') {
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

            $vendor->update(['iyzico_status' => 'rejected']);

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

            $request = $this->buildUpdateRequest($vendor);
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
            $request->setConversationId($this->utility->generateConversationId());
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
     * Ensure vendor is registered as SubMerchant
     */
    public function ensureSubMerchantRegistered(Vendor $vendor)
    {
        if (!config('iyzico.marketplace_enabled')) {
            return $this->successResponse(null, 'Marketplace devre dışı');
        }

        if ($vendor->iyzico_status === 'active' && !empty($vendor->iyzico_submerchant_key)) {
            return $this->successResponse([
                'submerchant_key' => $vendor->iyzico_submerchant_key,
            ], 'SubMerchant zaten kayıtlı');
        }

        return $this->createSubMerchant($vendor);
    }

    /**
     * Validate vendor data before API call
     */
    protected function validateVendorData(Vendor $vendor): array
    {
        if (empty($vendor->merchant_type)) {
            return ['valid' => false, 'message' => 'Satıcı türü belirtilmemiş'];
        }

        $iban = $this->getVendorIban($vendor);
        if (empty($iban)) {
            return ['valid' => false, 'message' => 'IBAN bilgisi bulunamadı'];
        }

        if (!$this->utility->validateIban($iban)) {
            return ['valid' => false, 'message' => 'IBAN formatı geçersiz'];
        }

        $address = $this->getVendorAddress($vendor);
        if (empty($address)) {
            return ['valid' => false, 'message' => 'Adres bilgisi bulunamadı'];
        }

        return ['valid' => true];
    }

    /**
     * Build create SubMerchant request
     */
    protected function buildCreateRequest(Vendor $vendor): CreateSubMerchantRequest
    {
        $request = new CreateSubMerchantRequest();
        
        // Set common fields
        $this->setCommonRequestFields($request, $vendor);
        
        // Set create-specific fields
        $request->setSubMerchantExternalId((string) $vendor->id);
        $request->setSubMerchantType($this->getSubMerchantType($vendor->merchant_type));
        $request->setAddress($this->getVendorAddress($vendor));
        $request->setIban($this->getVendorIban($vendor));

        // Set merchant type specific fields
        $this->setMerchantTypeFields($request, $vendor);

        return $request;
    }

    /**
     * Build update SubMerchant request
     */
    protected function buildUpdateRequest(Vendor $vendor): UpdateSubMerchantRequest
    {
        $request = new UpdateSubMerchantRequest();
        
        // Set common fields
        $this->setCommonRequestFields($request, $vendor);
        
        // Set update-specific fields
        $request->setSubMerchantKey($vendor->iyzico_submerchant_key);
        
        if ($address = $this->getVendorAddress($vendor)) {
            $request->setAddress($address);
        }
        
        if ($iban = $this->getVendorIban($vendor)) {
            $request->setIban($iban);
        }

        // Set merchant type specific fields
        $this->setMerchantTypeFieldsForUpdate($request, $vendor);

        return $request;
    }

    /**
     * Set merchant type specific fields for create
     */
    protected function setMerchantTypeFields(CreateSubMerchantRequest $request, Vendor $vendor): void
    {
        match ($vendor->merchant_type) {
            'personal' => $this->setPersonalFields($request, $vendor),
            'private_company' => $this->setPrivateCompanyFields($request, $vendor),
            'limited_company' => $this->setLimitedCompanyFields($request, $vendor),
            default => null,
        };
    }

    /**
     * Set merchant type specific fields for update
     */
    protected function setMerchantTypeFieldsForUpdate(UpdateSubMerchantRequest $request, Vendor $vendor): void
    {
        match ($vendor->merchant_type) {
            'personal' => $this->setPersonalFieldsForUpdate($request, $vendor),
            'private_company' => $this->setPrivateCompanyFieldsForUpdate($request, $vendor),
            'limited_company' => $this->setLimitedCompanyFieldsForUpdate($request, $vendor),
            default => null,
        };
    }

    /**
     * Get SubMerchant type from vendor merchant_type
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
     * Get vendor IBAN from bank account
     */
    protected function getVendorIban(Vendor $vendor): ?string
    {
        $bankAccount = $vendor->bankAccounts()
            ->where('is_primary', true)
            ->first();

        if (!$bankAccount) {
            $bankAccount = $vendor->bankAccounts()->first();
        }

        return $bankAccount?->iban;
    }

    // ==================== Helper Methods ====================

    /**
     * Set common fields for both create and update requests
     */
    protected function setCommonRequestFields($request, Vendor $vendor): void
    {
        $request->setLocale(Locale::TR);
        $request->setConversationId($this->utility->generateConversationId());
        $request->setEmail($vendor->email);
        $request->setGsmNumber($this->utility->formatPhoneNumber($vendor->phone));
        $request->setName($vendor->company_name ?? $vendor->name);
        $request->setCurrency(Currency::TL);
    }

    /**
     * Validate personal merchant type fields
     */
    protected function validatePersonalFields(Vendor $vendor): void
    {
        if (empty($vendor->identity_number)) {
            throw new \Exception('TC Kimlik numarası gereklidir');
        }
    }

    /**
     * Validate private company merchant type fields
     */
    protected function validatePrivateCompanyFields(Vendor $vendor): void
    {
        if (empty($vendor->identity_number) || empty($vendor->tax_office) || empty($vendor->legal_company_title)) {
            throw new \Exception('TC Kimlik, vergi dairesi ve yasal şirket ünvanı gereklidir');
        }
    }

    /**
     * Validate limited company merchant type fields
     */
    protected function validateLimitedCompanyFields(Vendor $vendor): void
    {
        if (empty($vendor->tax_id) || empty($vendor->tax_office) || empty($vendor->legal_company_title)) {
            throw new \Exception('Vergi numarası, vergi dairesi ve yasal şirket ünvanı gereklidir');
        }
    }

    /**
     * Set personal merchant type fields for create
     */
    protected function setPersonalFields(CreateSubMerchantRequest $request, Vendor $vendor): void
    {
        $this->validatePersonalFields($vendor);
        $request->setIdentityNumber($vendor->identity_number);
        $request->setContactName($vendor->contact_name ?? '');
        $request->setContactSurname($vendor->contact_surname ?? '');
    }

    /**
     * Set private company merchant type fields for create
     */
    protected function setPrivateCompanyFields(CreateSubMerchantRequest $request, Vendor $vendor): void
    {
        $this->validatePrivateCompanyFields($vendor);
        $request->setIdentityNumber($vendor->identity_number);
        $request->setTaxOffice($vendor->tax_office);
        $request->setLegalCompanyTitle($vendor->legal_company_title);
    }

    /**
     * Set limited company merchant type fields for create
     */
    protected function setLimitedCompanyFields(CreateSubMerchantRequest $request, Vendor $vendor): void
    {
        $this->validateLimitedCompanyFields($vendor);
        $request->setTaxNumber($vendor->tax_id);
        $request->setTaxOffice($vendor->tax_office);
        $request->setLegalCompanyTitle($vendor->legal_company_title);
    }

    /**
     * Set personal merchant type fields for update
     */
    protected function setPersonalFieldsForUpdate(UpdateSubMerchantRequest $request, Vendor $vendor): void
    {
        if ($vendor->identity_number) {
            $request->setIdentityNumber($vendor->identity_number);
        }
        if ($vendor->contact_name) {
            $request->setContactName($vendor->contact_name);
        }
        if ($vendor->contact_surname) {
            $request->setContactSurname($vendor->contact_surname);
        }
    }

    /**
     * Set private company merchant type fields for update
     */
    protected function setPrivateCompanyFieldsForUpdate(UpdateSubMerchantRequest $request, Vendor $vendor): void
    {
        if ($vendor->identity_number) {
            $request->setIdentityNumber($vendor->identity_number);
        }
        if ($vendor->tax_office) {
            $request->setTaxOffice($vendor->tax_office);
        }
        if ($vendor->legal_company_title) {
            $request->setLegalCompanyTitle($vendor->legal_company_title);
        }
    }

    /**
     * Set limited company merchant type fields for update
     */
    protected function setLimitedCompanyFieldsForUpdate(UpdateSubMerchantRequest $request, Vendor $vendor): void
    {
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

    /**
     * Get vendor address
     */
    protected function getVendorAddress(Vendor $vendor): ?string
    {
        try {
            // Use is_primary instead of address_type
            $address = $vendor->addresses()
                ->where('is_primary', true)
                ->first();

            if (!$address) {
                $address = $vendor->addresses()->first();
            }

            if (!$address) {
                return null;
            }

            // Only use city (district column doesn't exist)
            return trim("{$address->address_line}, {$address->city}");
        } catch (\Exception $e) {
            Log::warning('Error getting vendor address', [
                'vendor_id' => $vendor->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}
