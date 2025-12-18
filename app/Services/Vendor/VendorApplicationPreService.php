<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorApplicationPreServiceInterface;
use App\Services\BaseService;
use App\Repositories\VendorApplicationRepository;
use App\Repositories\VendorRepository;
use App\Models\VendorApplication;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * VendorApplicationPreService
 * 
 * Handles pre-application (ön başvuru) operations:
 * - Submit pre-application
 * - Approve pre-application (creates vendor account)
 * - Reject pre-application
 */
class VendorApplicationPreService extends BaseService implements VendorApplicationPreServiceInterface
{
    protected VendorApplicationRepository $applicationRepo;
    protected VendorRepository $vendorRepo;

    public function __construct(
        VendorApplicationRepository $applicationRepo,
        VendorRepository $vendorRepo
    ) {
        $this->applicationRepo = $applicationRepo;
        $this->vendorRepo = $vendorRepo;
    }

    /**
     * Submit pre-application (public)
     */
    public function submitPreApplication(array $data)
    {
        try {
            // Check if email already has pending application
            $existing = $this->applicationRepo->findByEmail($data['email']);
            
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

            $application = $this->applicationRepo->create([
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
     * Approve pre-application (admin)
     * Creates vendor account with pre_approved status
     */
    public function approvePreApplication(int $id, int $adminId)
    {
        try {
            $application = $this->applicationRepo->find($id);

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
            $this->applicationRepo->update($id, [
                'status' => VendorApplication::STATUS_APPROVED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // Create vendor account with pre_approved status
            $vendor = $this->vendorRepo->create([
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
            $this->applicationRepo->update($application->id, [
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
     * Reject pre-application (admin)
     */
    public function rejectPreApplication(int $id, int $adminId, string $reason)
    {
        try {
            $application = $this->applicationRepo->find($id);

            if (!$application) {
                return $this->errorResponse('Başvuru bulunamadı', 404);
            }

            if (!$application->isPreApplication()) {
                return $this->errorResponse('Bu bir ön başvuru değil', 400);
            }

            if (!$application->isPending()) {
                return $this->errorResponse('Başvuru zaten incelenmiş', 400);
            }

            $application = $this->applicationRepo->update($id, [
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
}
