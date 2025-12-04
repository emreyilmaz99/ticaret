<?php

namespace App\Services;

use App\Repositories\VendorApplicationRepository;
use App\Repositories\VendorRepository;
use App\Models\VendorApplication;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VendorApplicationService extends BaseService
{
    protected VendorApplicationRepository $applicationRepository;
    protected VendorRepository $vendorRepository;
    protected IyzicoService $iyzicoService;

    public function __construct(
        VendorApplicationRepository $applicationRepository,
        VendorRepository $vendorRepository,
        IyzicoService $iyzicoService
    ) {
        $this->applicationRepository = $applicationRepository;
        $this->vendorRepository = $vendorRepository;
        $this->iyzicoService = $iyzicoService;
    }

    /**
     * Submit pre-application (public) - Ön Başvuru
     * Bu aşamada sadece VendorApplication kaydı oluşturulur
     */
    public function submitPreApplication(array $data)
    {
        try {
            // Check if email already has pending application
            $existing = $this->applicationRepository->findByEmail($data['email']);
            
            if ($existing && $existing->isPending()) {
                return $this->errorResponse('Bu e-posta ile zaten bekleyen bir başvuru var', 400);
            }

            // Check if vendor already exists
            $existingVendor = Vendor::where('email', $data['email'])->first();
            if ($existingVendor) {
                return $this->errorResponse('Bu e-posta ile zaten bir satıcı hesabı mevcut. Lütfen giriş yapın.', 400, [
                    'redirect_to_login' => true
                ]);
            }

            $application = $this->applicationRepository->create([
                'type' => VendorApplication::TYPE_PRE_APPLICATION,
                'status' => VendorApplication::STATUS_PENDING,
                'email' => $data['email'],
                'full_name' => $data['full_name'],
                'company_name' => $data['company_name'] ?? null,
                'phone' => $data['phone'] ?? null,
                'tax_id' => $data['tax_id'] ?? null,
                'password' => bcrypt($data['password']),
            ]);

            return $this->successResponse($application, 'Ön başvurunuz alındı. Admin onayı bekleniyor.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Approve pre-application (admin) - Ön Başvuruyu Onayla
     * Bu aşamada Vendor hesabı oluşturulur (status: pre_approved)
     */
    public function approvePreApplication(int $id, int $adminId)
    {
        try {
            $application = $this->applicationRepository->find($id);

            if (!$application) {
                return $this->errorResponse('Başvuru bulunamadı', 404);
            }

            if (!$application->isPreApplication()) {
                return $this->errorResponse('Bu bir ön başvuru değil', 400);
            }

            if (!$application->isPending()) {
                return $this->errorResponse('Başvuru zaten incelenmiş', 400);
            }

            // Check if vendor already exists
            $existingVendor = Vendor::where('email', $application->email)->first();
            if ($existingVendor) {
                return $this->errorResponse('Bu e-posta ile zaten bir satıcı hesabı mevcut', 400);
            }

            DB::beginTransaction();

            // Update application status
            $this->applicationRepository->update($id, [
                'status' => VendorApplication::STATUS_APPROVED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // Create vendor account with pre_approved status
            $vendor = $this->vendorRepository->create([
                'application_id' => $application->id,
                'name' => $application->full_name,
                'email' => $application->email,
                'password' => $application->password, // Already hashed
                'company_name' => $application->company_name,
                'slug' => Str::slug($application->company_name ?? $application->full_name) . '-' . Str::random(4),
                'tax_id' => $application->tax_id,
                'phone' => $application->phone,
                'status' => Vendor::STATUS_PRE_APPROVED,
                'onboarding_completed' => false,
                'iyzico_status' => Vendor::IYZICO_STATUS_NOT_REGISTERED,
            ]);

            // Link vendor to application
            $this->applicationRepository->update($application->id, [
                'vendor_id' => $vendor->id
            ]);

            DB::commit();

            // TODO: Send email to applicant with full application link

            return $this->successResponse([
                'application' => $application->fresh(),
                'vendor' => $vendor
            ], 'Ön başvuru onaylandı, satıcı hesabı oluşturuldu');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Reject pre-application (admin) - Ön Başvuruyu Reddet
     */
    public function rejectPreApplication(int $id, int $adminId, string $reason)
    {
        try {
            $application = $this->applicationRepository->find($id);

            if (!$application) {
                return $this->errorResponse('Başvuru bulunamadı', 404);
            }

            if (!$application->isPreApplication()) {
                return $this->errorResponse('Bu bir ön başvuru değil', 400);
            }

            if (!$application->isPending()) {
                return $this->errorResponse('Başvuru zaten incelenmiş', 400);
            }

            $application = $this->applicationRepository->update($id, [
                'status' => VendorApplication::STATUS_REJECTED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
                'rejection_reason' => $reason,
            ]);

            // TODO: Send email to applicant with rejection reason

            return $this->successResponse($application, 'Ön başvuru reddedildi');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Submit full application (vendor) - Temel Başvuru
     * Vendor login olduktan sonra bu formu doldurur
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
            $application = $this->applicationRepository->create([
                'vendor_id' => $vendor->id,
                'type' => VendorApplication::TYPE_FULL_APPLICATION,
                'status' => VendorApplication::STATUS_PENDING,
                'email' => $vendor->email,
                'full_name' => $data['full_name'] ?? $vendor->name,
                'company_name' => $data['company_name'],
                'phone' => $data['phone'],
                'tax_id' => $data['tax_id'] ?? null,
                // iyzico SubMerchant fields
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
            $vendorUpdateData = [
                'status' => Vendor::STATUS_PENDING_FULL_APPROVAL,
                'name' => $data['full_name'] ?? $vendor->name,
                'company_name' => $data['company_name'],
                'phone' => $data['phone'],
                'tax_id' => $data['tax_id'] ?? $vendor->tax_id,
                'slug' => $data['slug'] ?? $vendor->slug,
                // iyzico SubMerchant fields
                'merchant_type' => $data['merchant_type'],
                'identity_number' => $data['identity_number'] ?? null,
                'contact_name' => $data['contact_name'] ?? null,
                'contact_surname' => $data['contact_surname'] ?? null,
                'tax_office' => $data['tax_office'] ?? null,
                'legal_company_title' => $data['legal_company_title'] ?? null,
                'iyzico_status' => Vendor::IYZICO_STATUS_PENDING,
            ];

            $this->vendorRepository->update($vendor->id, $vendorUpdateData);

            // Create/Update vendor address
            $existingAddress = $vendor->addresses()->where('is_primary', true)->first();
            if ($existingAddress) {
                $existingAddress->update([
                    'address_line' => $data['address'],
                    'city' => $data['city'],
                    'country' => 'Türkiye',
                    'postal_code' => $data['postal_code'] ?? null,
                ]);
            } else {
                \App\Models\VendorAddress::create([
                    'vendor_id' => $vendor->id,
                    'address_line' => $data['address'],
                    'city' => $data['city'],
                    'country' => 'Türkiye',
                    'postal_code' => $data['postal_code'] ?? null,
                    'is_primary' => true,
                ]);
            }

            // Create/Update vendor bank account
            if (!empty($data['iban'])) {
                $existingBank = $vendor->bankAccounts()->where('is_primary', true)->first();
                $bankData = [
                    'bank_name' => $data['bank_name'] ?? 'Belirtilmedi',
                    'account_holder' => $data['account_holder'] ?? $data['full_name'] ?? $vendor->name,
                    'iban' => $this->formatIban($data['iban']),
                    'currency' => 'TRY',
                    'is_primary' => true,
                ];

                if ($existingBank) {
                    $existingBank->update($bankData);
                } else {
                    $bankData['vendor_id'] = $vendor->id;
                    \App\Models\VendorBankAccount::create($bankData);
                }
            }

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
            $application = $this->applicationRepository->find($id);

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

            DB::beginTransaction();

            // Approve application
            $this->applicationRepository->update($id, [
                'status' => VendorApplication::STATUS_APPROVED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // Determine commission plan
            $finalCommissionPlanId = $commissionPlanId;
            if (!$finalCommissionPlanId) {
                $defaultPlan = \App\Models\CommissionPlan::where('is_default', true)->first();
                $finalCommissionPlanId = $defaultPlan?->id;
            }

            // Activate vendor
            $vendorUpdateData = [
                'status' => Vendor::STATUS_ACTIVE,
                'activated_at' => now(),
                'onboarding_completed' => true,
            ];
            
            if ($finalCommissionPlanId) {
                $vendorUpdateData['commission_plan_id'] = $finalCommissionPlanId;
            }

            $this->vendorRepository->update($application->vendor->id, $vendorUpdateData);

            DB::commit();

            // iyzico SubMerchant kaydı (transaction dışında)
            $vendor = $application->vendor->fresh();
            $iyzicoResult = $this->iyzicoService->ensureSubMerchantRegistered($vendor);
            
            if (!$iyzicoResult->isSuccess()) {
                Log::warning('iyzico SubMerchant registration failed', [
                    'vendor_id' => $vendor->id,
                    'error' => $iyzicoResult->getMessage(),
                ]);
                
                return $this->successResponse([
                    'application' => $application->fresh(),
                    'vendor' => $vendor,
                    'iyzico_warning' => true,
                    'iyzico_error' => $iyzicoResult->getMessage(),
                ], 'Satıcı onaylandı ancak iyzico kaydı başarısız: ' . $iyzicoResult->getMessage());
            }

            return $this->successResponse([
                'application' => $application->fresh(),
                'vendor' => $vendor->fresh()
            ], 'Satıcı onaylandı ve iyzico kaydı tamamlandı');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Reject full application (admin)
     */
    public function rejectFullApplication(int $id, int $adminId, string $reason)
    {
        try {
            $application = $this->applicationRepository->find($id);

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
            $this->applicationRepository->update($id, [
                'status' => VendorApplication::STATUS_REJECTED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
                'rejection_reason' => $reason,
            ]);

            // Revert vendor status to pre_approved so they can submit again
            if ($application->vendor) {
                $this->vendorRepository->update($application->vendor->id, [
                    'status' => Vendor::STATUS_PRE_APPROVED,
                    'iyzico_status' => Vendor::IYZICO_STATUS_REJECTED,
                ]);
            }

            DB::commit();

            // TODO: Send email to vendor with rejection reason

            return $this->successResponse($application->fresh(), 'Temel başvuru reddedildi. Satıcı tekrar başvuru yapabilir.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get vendor's current application status with details
     */
    public function getVendorApplicationStatus(Vendor $vendor)
    {
        try {
            $latestApplication = $vendor->applications()->latest()->first();
            $latestFullApplication = $vendor->applications()
                ->where('type', VendorApplication::TYPE_FULL_APPLICATION)
                ->latest()
                ->first();

            $statusInfo = [
                'vendor_status' => $vendor->status,
                'vendor_status_label' => $vendor->status_label,
                'iyzico_status' => $vendor->iyzico_status,
                'iyzico_status_label' => $vendor->iyzico_status_label,
                'can_submit_full_application' => $vendor->needsFullApplication(),
                'is_awaiting_approval' => $vendor->isAwaitingFullApproval(),
                'is_active' => $vendor->status === Vendor::STATUS_ACTIVE,
                'can_receive_payments' => $vendor->canReceivePayments(),
                'latest_rejection_reason' => null,
                'latest_application' => null,
            ];

            // Get rejection reason if applicable
            if ($latestFullApplication && $latestFullApplication->isRejected()) {
                $statusInfo['latest_rejection_reason'] = $latestFullApplication->rejection_reason;
            }

            // Include latest application details
            if ($latestApplication) {
                $statusInfo['latest_application'] = [
                    'id' => $latestApplication->id,
                    'type' => $latestApplication->type,
                    'status' => $latestApplication->status,
                    'reviewed_at' => $latestApplication->reviewed_at?->toIso8601String(),
                    'rejection_reason' => $latestApplication->rejection_reason,
                ];
            }

            return $this->successResponse($statusInfo, 'Başvuru durumu');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get all applications (admin)
     */
    public function index(array $filters = [])
    {
        try {
            $applications = $this->applicationRepository->paginate(15, $filters);
            return $this->successResponse($applications, 'Başvurular listelendi');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get pending pre-applications (admin)
     */
    public function getPendingPreApplications()
    {
        try {
            $applications = $this->applicationRepository->getPendingPreApplications();
            return $this->successResponse($applications, 'Bekleyen ön başvurular');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get application details
     */
    public function show(int $id)
    {
        try {
            $application = $this->applicationRepository->find($id);

            if (!$application) {
                return $this->errorResponse('Başvuru bulunamadı', 404);
            }

            $application->load(['reviewer', 'vendor']);

            return $this->successResponse($application, 'Başvuru detayları');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Format IBAN - remove spaces and ensure uppercase
     */
    protected function formatIban(?string $iban): ?string
    {
        if (empty($iban)) {
            return null;
        }
        return strtoupper(preg_replace('/\s+/', '', $iban));
    }
}
