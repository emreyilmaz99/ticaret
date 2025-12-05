<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\RejectApplicationRequest;
use App\Services\VendorApplicationService;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class VendorApplicationController extends Controller
{
    use ResponseHttp;

    protected VendorApplicationService $applicationService;

    public function __construct(VendorApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * List all applications
     */
    public function index(Request $request)
    {
        // Filter out empty values to avoid querying for empty strings
        $filters = array_filter($request->only(['status', 'type']), function ($value) {
            return !is_null($value) && $value !== '';
        });
        
        $result = $this->applicationService->index($filters);
        return $this->fromServiceResponse($result);
    }

    /**
     * Get pending pre-applications
     */
    public function pendingPreApplications()
    {
        $result = $this->applicationService->getPendingPreApplications();
        return $this->fromServiceResponse($result);
    }

    /**
     * Show application details
     */
    public function show(int $id)
    {
        $result = $this->applicationService->show($id);
        return $this->fromServiceResponse($result);
    }

    /**
     * Approve pre-application
     */
    public function approvePreApplication(int $id, Request $request)
    {
        $adminId = $request->user()->id;
        $result = $this->applicationService->approvePreApplication($id, $adminId);
        return $this->fromServiceResponse($result);
    }

    /**
     * Approve full application
     */
    public function approveFullApplication(int $id, Request $request)
    {
        $adminId = $request->user()->id;
        $commissionPlanId = $request->input('commission_plan_id');
        $result = $this->applicationService->approveFullApplication($id, $adminId, $commissionPlanId);
        return $this->fromServiceResponse($result);
    }

    /**
     * Reject pre-application
     */
    public function rejectPreApplication(int $id, RejectApplicationRequest $request)
    {
        $adminId = $request->user()->id;
        $result = $this->applicationService->rejectPreApplication(
            $id,
            $adminId,
            $request->input('rejection_reason')
        );
        return $this->fromServiceResponse($result);
    }

    /**
     * Reject full application
     */
    public function rejectFullApplication(int $id, RejectApplicationRequest $request)
    {
        $adminId = $request->user()->id;
        $result = $this->applicationService->rejectFullApplication(
            $id,
            $adminId,
            $request->input('rejection_reason')
        );
        return $this->fromServiceResponse($result);
    }

    /**
     * Approve vendor's full application (vendor-based endpoint)
     */
    public function approveVendorFull(int $vendorId, Request $request)
    {
        $adminId = $request->user()->id;
        $commissionPlanId = $request->input('commission_plan_id');
        $result = $this->applicationService->approveVendorFullApplication($vendorId, $adminId, $commissionPlanId);
        return $this->fromServiceResponse($result);
    }

    /**
     * Reject vendor's full application (vendor-based endpoint)
     */
    public function rejectVendorFull(int $vendorId, RejectApplicationRequest $request)
    {
        $adminId = $request->user()->id;
        $result = $this->applicationService->rejectVendorFullApplication(
            $vendorId,
            $adminId,
            $request->input('rejection_reason')
        );
        return $this->fromServiceResponse($result);
    }
}
