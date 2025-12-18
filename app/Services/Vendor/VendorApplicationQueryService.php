<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorApplicationQueryServiceInterface;
use App\Services\BaseService;
use App\Repositories\VendorApplicationRepository;
use App\Models\VendorApplication;
use App\Models\Vendor;

/**
 * VendorApplicationQueryService
 * 
 * Handles query and listing operations:
 * - List applications with filters
 * - Show application details
 * - Get vendor application status
 * - Get pending pre-applications
 */
class VendorApplicationQueryService extends BaseService implements VendorApplicationQueryServiceInterface
{
    protected VendorApplicationRepository $applicationRepo;

    public function __construct(VendorApplicationRepository $applicationRepo)
    {
        $this->applicationRepo = $applicationRepo;
    }

    /**
     * Get all applications (admin)
     */
    public function index(array $filters = [])
    {
        try {
            $applications = $this->applicationRepo->paginate(15, $filters);
            return $this->successResponse($applications, 'Başvurular listelendi');
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
            $application = $this->applicationRepo->find($id);

            if (!$application) {
                return $this->errorResponse('Başvuru bulunamadı', 404);
            }

            return $this->successResponse($application, 'Başvuru detayları');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get vendor application status (vendor)
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
                // Include vendor details for form pre-fill
                'vendor' => [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'email' => $vendor->email,
                    'company_name' => $vendor->company_name,
                    'slug' => $vendor->slug,
                    'phone' => $vendor->phone,
                    'tax_id' => $vendor->tax_id,
                ],
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
     * Get pending pre-applications (admin)
     */
    public function getPendingPreApplications()
    {
        try {
            $applications = $this->applicationRepo->getPendingPreApplications();
            return $this->successResponse($applications, 'Bekleyen ön başvurular');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
}
