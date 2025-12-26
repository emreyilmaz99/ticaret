<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorApplicationFullServiceInterface;
use App\Services\BaseService;
use App\Services\Payment\IyzicoService;
use App\Repositories\Interfaces\VendorApplicationRepositoryInterface;
use App\Repositories\Interfaces\VendorRepositoryInterface;
use App\Repositories\Interfaces\VendorAddressRepositoryInterface;
use App\Repositories\Interfaces\VendorBankAccountRepositoryInterface;
use App\Repositories\Interfaces\CommissionPlanRepositoryInterface;
use App\Models\VendorApplication;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * VendorApplicationFullService
 * 
 * Handles full application (temel başvuru) operations:
 * - Submit full application
 * - Approve full application (activates vendor + iyzico registration)
 * - Reject full application
 * - Vendor-based approval/rejection
 */
class VendorApplicationFullService extends BaseService implements VendorApplicationFullServiceInterface
{
    public function __construct(
        private readonly VendorApplicationRepositoryInterface $applicationRepo,
        private readonly VendorRepositoryInterface $vendorRepo,
        private readonly VendorAddressRepositoryInterface $addressRepo,
        private readonly VendorBankAccountRepositoryInterface $bankRepo,
        private readonly CommissionPlanRepositoryInterface $commissionPlanRepo,
        private readonly IyzicoService $iyzicoService
    ) {}

    /**
     * Submit full application (vendor)
     */
    public function submitFullApplication(Vendor $vendor, array $data)
    {
        try {
            // Vendor must be in pre_approved status
            if ($vendor->status !== Vendor::STATUS_PRE_APPROVED) {
                if ($vendor->status === Vendor::STATUS_PENDING_FULL_APPROVAL) {
                    return $this->errorResponse('Temel başvurunuz zaten inceleniyor', 400);
                }
                if ($vendor->status === Vendor::STATUS_ACTIVE) {
                    return $this->errorResponse('Hesabınız zaten aktif', 400);
                }
                return $this->errorResponse('Bu işlem için yetkiniz yok', 403);
            }

            DB::beginTransaction();

            // Create new full application
            $application = $this->applicationRepo->create([
                'vendor_id' => $vendor->id,
                'type' => VendorApplication::TYPE_FULL_APPLICATION,
                'status' => VendorApplication::STATUS_PENDING,
                'email' => $vendor->email,
                'full_name' => $data['full_name'] ?? $vendor->name,
                'company_name' => $data['company_name'],
                'phone' => $data['phone'],
                'tax_id' => $data['tax_id'] ?? null,
                'merchant_type' => $data['merchant_type'],
                'identity_number' => $data['identity_number'] ?? null,
                'contact_name' => $data['contact_name'] ?? null,
                'contact_surname' => $data['contact_surname'] ?? null,
                'tax_office' => $data['tax_office'] ?? null,
                'legal_company_title' => $data['legal_company_title'] ?? null,
                'iban' => $this->formatIban($data['iban'] ?? ''),
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'district' => $data['district'] ?? null,
                'postal_code' => $data['postal_code'] ?? null,
            ]);

            // Update vendor with form data
            $this->vendorRepo->update($vendor->id, [
                'status' => Vendor::STATUS_PENDING_FULL_APPROVAL,
                'name' => $data['full_name'] ?? $vendor->name,
                'company_name' => $data['company_name'],
                'phone' => $data['phone'],
                'tax_id' => $data['tax_id'] ?? $vendor->tax_id,
                'slug' => $data['slug'] ?? $vendor->slug,
                'merchant_type' => $data['merchant_type'],
                'identity_number' => $data['identity_number'] ?? null,
                'contact_name' => $data['contact_name'] ?? null,
                'contact_surname' => $data['contact_surname'] ?? null,
                'tax_office' => $data['tax_office'] ?? null,
                'legal_company_title' => $data['legal_company_title'] ?? null,
                'iyzico_status' => Vendor::IYZICO_STATUS_PENDING,
            ]);

            // Update or create vendor address
            $this->updateOrCreateAddress($vendor, $data);

            // Update or create bank account
            $this->updateOrCreateBankAccount($vendor, $data);

            DB::commit();

            return $this->successResponse([
                'application' => $application,
                'vendor' => $vendor->fresh()
            ], 'Temel başvurunuz alındı. Admin onayı bekleniyor.', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Approve full application and activate vendor (admin)
     */
    public function approveFullApplication(int $id, int $adminId, ?int $commissionPlanId = null)
    {
        try {
            $application = $this->applicationRepo->find($id);

            if (!$application) {
                return $this->errorResponse('Başvuru bulunamadı', 404);
            }

            if (!$application->isFullApplication()) {
                return $this->errorResponse('Bu bir temel başvuru değil', 400);
            }

            if (!$application->vendor) {
                return $this->errorResponse('İlişkili satıcı hesabı bulunamadı', 400);
            }

            if (!$application->isPending()) {
                return $this->errorResponse('Başvuru zaten incelenmiş', 400);
            }

            $vendor = $application->vendor;

            // Try iyzico SubMerchant registration FIRST
            Log::info('Starting iyzico SubMerchant registration', ['vendor_id' => $vendor->id]);
            
            $iyzicoResult = $this->iyzicoService->ensureSubMerchantRegistered($vendor);
            
            if (!$iyzicoResult->isSuccess()) {
                Log::warning('iyzico SubMerchant registration failed', [
                    'vendor_id' => $vendor->id,
                    'error' => $iyzicoResult->getMessage(),
                ]);
                
                return $this->errorResponse(
                    'iyzico kaydı başarısız: ' . $iyzicoResult->getMessage() . '. Satıcı onay listesinde kalmaya devam ediyor.',
                    400,
                    ['iyzico_error' => true]
                );
            }

            Log::info('iyzico SubMerchant registration successful', ['vendor_id' => $vendor->id]);

            DB::beginTransaction();

            // Approve application
            $this->applicationRepo->update($id, [
                'status' => VendorApplication::STATUS_APPROVED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // Determine commission plan
            $finalCommissionPlanId = $commissionPlanId ?? $this->getDefaultCommissionPlanId();

            // Activate vendor
            $this->vendorRepo->update($vendor->id, [
                'status' => Vendor::STATUS_ACTIVE,
                'activated_at' => now(),
                'onboarding_completed' => true,
                'commission_plan_id' => $finalCommissionPlanId,
            ]);

            DB::commit();

            return $this->successResponse([
                'application' => $application->fresh(),
                'vendor' => $vendor->fresh()
            ], 'Satıcı onaylandı ve iyzico kaydı tamamlandı');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Full application approval error: ' . $e->getMessage());
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Reject full application (admin)
     */
    public function rejectFullApplication(int $id, int $adminId, string $reason)
    {
        try {
            $application = $this->applicationRepo->find($id);

            if (!$application) {
                return $this->errorResponse('Başvuru bulunamadı', 404);
            }

            if (!$application->isFullApplication()) {
                return $this->errorResponse('Bu bir temel başvuru değil', 400);
            }

            if (!$application->isPending()) {
                return $this->errorResponse('Başvuru zaten incelenmiş', 400);
            }

            DB::beginTransaction();

            // Reject application
            $this->applicationRepo->update($id, [
                'status' => VendorApplication::STATUS_REJECTED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
                'rejection_reason' => $reason,
            ]);

            // Revert vendor status
            if ($application->vendor) {
                $this->vendorRepo->update($application->vendor->id, [
                    'status' => Vendor::STATUS_PRE_APPROVED,
                    'iyzico_status' => Vendor::IYZICO_STATUS_REJECTED,
                ]);
            }

            DB::commit();

            return $this->successResponse($application->fresh(), 'Temel başvuru reddedildi. Satıcı tekrar başvuru yapabilir.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Approve vendor's full application by vendor ID
     */
    public function approveVendorFullApplication(int $vendorId, int $adminId, ?int $commissionPlanId = null)
    {
        $vendor = $this->vendorRepo->findById($vendorId);

        if (!$vendor) {
            return $this->errorResponse('Satıcı bulunamadı', 404);
        }

        $application = $vendor->applications()
            ->where('type', VendorApplication::TYPE_FULL_APPLICATION)
            ->where('status', VendorApplication::STATUS_PENDING)
            ->latest()
            ->first();

        if (!$application) {
            return $this->errorResponse('Satıcının temel başvurusu bulunamadı', 404);
        }

        return $this->approveFullApplication($application->id, $adminId, $commissionPlanId);
    }

    /**
     * Reject vendor's full application by vendor ID
     */
    public function rejectVendorFullApplication(int $vendorId, int $adminId, string $reason)
    {
        $vendor = $this->vendorRepo->findById($vendorId);

        if (!$vendor) {
            return $this->errorResponse('Satıcı bulunamadı', 404);
        }

        $application = $vendor->applications()
            ->where('type', VendorApplication::TYPE_FULL_APPLICATION)
            ->latest()
            ->first();

        if (!$application) {
            return $this->errorResponse('Satıcının temel başvurusu bulunamadı', 404);
        }

        return $this->rejectFullApplication($application->id, $adminId, $reason);
    }

    /**
     * Update or create vendor address
     */
    protected function updateOrCreateAddress(Vendor $vendor, array $data): void
    {
        $existingAddress = $this->addressRepo->findPrimaryForVendor($vendor->id);
        
        $addressData = [
            'address_line' => $data['address'],
            'city' => $data['city'],
            'country' => 'Türkiye',
            'postal_code' => $data['postal_code'] ?? null,
        ];

        if ($existingAddress) {
            $this->addressRepo->update($existingAddress->id, $addressData);
        } else {
            $this->addressRepo->create(array_merge($addressData, [
                'vendor_id' => $vendor->id,
                'is_primary' => true,
            ]));
        }
    }

    /**
     * Update or create vendor bank account
     */
    protected function updateOrCreateBankAccount(Vendor $vendor, array $data): void
    {
        if (empty($data['iban'])) {
            return;
        }

        $existingBank = $this->bankRepo->findPrimaryForVendor($vendor->id);
        
        $bankData = [
            'bank_name' => $data['bank_name'] ?? 'Belirtilmedi',
            'account_holder' => $data['account_holder'] ?? $data['full_name'] ?? $vendor->name,
            'iban' => $this->formatIban($data['iban']),
            'currency' => 'TRY',
            'is_primary' => true,
        ];

        if ($existingBank) {
            $this->bankRepo->update($existingBank->id, $bankData);
        } else {
            $this->bankRepo->create(array_merge($bankData, [
                'vendor_id' => $vendor->id,
            ]));
        }
    }

    /**
     * Format IBAN
     */
    protected function formatIban(?string $iban): ?string
    {
        if (empty($iban)) {
            return null;
        }
        return strtoupper(preg_replace('/\s+/', '', $iban));
    }

    /**
     * Get default commission plan ID
     */
    protected function getDefaultCommissionPlanId(): ?int
    {
        $defaultPlan = $this->commissionPlanRepo->findDefault();
        return $defaultPlan?->id;
    }
}
