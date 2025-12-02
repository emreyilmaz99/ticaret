<?php

namespace App\Services;

use App\Repositories\VendorApplicationRepository;
use App\Repositories\VendorRepository;
use App\Models\VendorApplication;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VendorApplicationService extends BaseService
{
    protected VendorApplicationRepository $applicationRepository;
    protected VendorRepository $vendorRepository;

    public function __construct(
        VendorApplicationRepository $applicationRepository,
        VendorRepository $vendorRepository
    ) {
        $this->applicationRepository = $applicationRepository;
        $this->vendorRepository = $vendorRepository;
    }

    /**
     * Submit pre-application (public)
     */
    public function submitPreApplication(array $data)
    {
        try {
            // Check if email already has pending application
            $existing = $this->applicationRepository->findByEmail($data['email']);
            
            if ($existing && $existing->isPending()) {
                return $this->errorResponse('You already have a pending application', 400);
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

            return $this->successResponse($application, 'Pre-application submitted successfully', 201);
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
            // Always use paginate with filters to respect both status AND type
            $applications = $this->applicationRepository->paginate(15, $filters);

            return $this->successResponse($applications, 'Applications retrieved successfully');
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
            return $this->successResponse($applications, 'Pending pre-applications retrieved');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Approve pre-application (admin)
     */
    public function approvePreApplication(int $id, int $adminId)
    {
        try {
            $application = $this->applicationRepository->find($id);

            if (!$application) {
                return $this->errorResponse('Application not found', 404);
            }

            if (!$application->isPreApplication()) {
                return $this->errorResponse('Not a pre-application', 400);
            }

            if (!$application->isPending()) {
                return $this->errorResponse('Application already reviewed', 400);
            }

            $application = $this->applicationRepository->update($id, [
                'status' => VendorApplication::STATUS_APPROVED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // TODO: Send email to applicant with full application link

            return $this->successResponse($application, 'Pre-application approved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Reject application (admin)
     */
    public function rejectApplication(int $id, int $adminId, string $reason)
    {
        try {
            $application = $this->applicationRepository->find($id);

            if (!$application) {
                return $this->errorResponse('Application not found', 404);
            }

            if (!$application->isPending()) {
                return $this->errorResponse('Application already reviewed', 400);
            }

            $application = $this->applicationRepository->update($id, [
                'status' => VendorApplication::STATUS_REJECTED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
                'rejection_reason' => $reason,
            ]);

            // TODO: Send email to applicant with rejection reason

            return $this->successResponse($application, 'Application rejected');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Submit full application and create vendor account
     * Updates the existing pre-application to full_application type
     */
    public function submitFullApplication(int $preApplicationId, array $data)
    {
        try {
            $preApp = $this->applicationRepository->find($preApplicationId);

            if (!$preApp) {
                return $this->errorResponse('Application not found', 404);
            }

            if (!$preApp->isPreApplication()) {
                return $this->errorResponse('This application has already been converted to full application', 400);
            }

            if (!$preApp->isApproved()) {
                return $this->errorResponse('Pre-application must be approved first', 400);
            }

            // Check if vendor already exists with this email
            $existingVendor = \App\Models\Vendor::where('email', $preApp->email)->first();
            if ($existingVendor) {
                // If vendor exists and is active, redirect to login
                if ($existingVendor->status === 'active') {
                    return $this->errorResponse('Vendor account already exists and is active. Please login.', 403, [
                        'redirect_to_login' => true
                    ]);
                }
                // If vendor exists but inactive, redirect to login (admin will activate)
                return $this->errorResponse('Vendor account already exists. Please login or wait for admin approval.', 400, [
                    'redirect_to_login' => true,
                    'vendor_status' => $existingVendor->status
                ]);
            }

            DB::beginTransaction();

            // Update existing application to full_application type
            $this->applicationRepository->update($preApplicationId, [
                'type' => VendorApplication::TYPE_FULL_APPLICATION,
                'status' => VendorApplication::STATUS_PENDING, // Back to pending for admin review
                'company_name' => $data['company_name'],
                'phone' => $data['phone'],
                'tax_id' => $data['tax_id'] ?? $preApp->tax_id,
                'reviewed_by' => null, // Reset review info for full application review
                'reviewed_at' => null,
            ]);

            // Reload the updated application
            $application = $this->applicationRepository->find($preApplicationId);

            // Create vendor account with the password from pre-application (already hashed)
            $vendor = $this->vendorRepository->create([
                'application_id' => $application->id,
                'name' => $data['full_name'] ?? $preApp->full_name,
                'email' => $preApp->email,
                'password' => $preApp->password, // Already hashed - Vendor model will detect this
                'company_name' => $data['company_name'],
                'slug' => $data['slug'],
                'tax_id' => $data['tax_id'] ?? $preApp->tax_id,
                'phone' => $data['phone'],
                'status' => 'inactive',
                'onboarding_completed' => false,
            ]);

            // Create vendor address
            \App\Models\VendorAddress::create([
                'vendor_id' => $vendor->id,
                'address_line' => $data['address_line'],
                'city' => $data['city'],
                'country' => $data['country'],
                'postal_code' => $data['postal_code'] ?? null,
                'is_primary' => true,
            ]);

            // Create vendor bank account
            if (!empty($data['bank_name']) && !empty($data['iban'])) {
                \App\Models\VendorBankAccount::create([
                    'vendor_id' => $vendor->id,
                    'bank_name' => $data['bank_name'],
                    'account_holder' => $data['account_holder'] ?? $data['full_name'] ?? $preApp->full_name,
                    'iban' => $data['iban'],
                    'currency' => 'TRY',
                    'is_primary' => true,
                ]);
            }

            // Link vendor to application
            $this->applicationRepository->update($application->id, [
                'vendor_id' => $vendor->id
            ]);

            DB::commit();

            return $this->successResponse([
                'application' => $application,
                'vendor' => $vendor
            ], 'Full application submitted successfully. Waiting for admin approval.', 201);

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
                return $this->errorResponse('Application not found', 404);
            }

            if (!$application->isFullApplication()) {
                return $this->errorResponse('Not a full application', 400);
            }

            if (!$application->vendor) {
                return $this->errorResponse('No vendor account linked', 400);
            }

            DB::beginTransaction();

            // Approve application
            $this->applicationRepository->update($id, [
                'status' => VendorApplication::STATUS_APPROVED,
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // Determine commission plan - use provided or default
            $finalCommissionPlanId = $commissionPlanId;
            if (!$finalCommissionPlanId) {
                $defaultPlan = \App\Models\CommissionPlan::where('is_default', true)->first();
                $finalCommissionPlanId = $defaultPlan?->id;
            }

            // Activate vendor with commission plan
            $vendorUpdateData = [
                'status' => 'active',
                'activated_at' => now(),
            ];
            
            if ($finalCommissionPlanId) {
                $vendorUpdateData['commission_plan_id'] = $finalCommissionPlanId;
            }

            $this->vendorRepository->update($application->vendor->id, $vendorUpdateData);

            DB::commit();

            return $this->successResponse($application, 'Vendor approved and activated');
        } catch (\Exception $e) {
            DB::rollBack();
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
                return $this->errorResponse('Application not found', 404);
            }

            // Check if vendor account already exists and is active
            $vendor = \App\Models\Vendor::where('email', $application->email)->first();
            if ($vendor && $vendor->status === 'active') {
                return $this->errorResponse('Vendor account is already active', 403, [
                    'redirect_to_dashboard' => true
                ]);
            }

            $application->load(['reviewer', 'vendor']);

            return $this->successResponse($application, 'Application retrieved');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
}
