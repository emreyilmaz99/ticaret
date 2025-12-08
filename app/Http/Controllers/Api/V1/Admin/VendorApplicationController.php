<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\RejectApplicationRequest;
use App\Services\Vendor\VendorApplicationPreService;
use App\Services\Vendor\VendorApplicationFullService;
use App\Services\Vendor\VendorApplicationQueryService;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class VendorApplicationController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected VendorApplicationPreService $preService,
        protected VendorApplicationFullService $fullService,
        protected VendorApplicationQueryService $queryService
    ) {}

    /**
     * List all applications
     */
    public function index(Request $request)
    {
        // Filter out empty values to avoid querying for empty strings
        $filters = array_filter($request->only(['status', 'type']), function ($value) {
            return !is_null($value) && $value !== '';
        });
        
        $result = $this->queryService->index($filters);
        return $this->fromServiceResponse($result);
    }

    /**
     * Get pending pre-applications
     */
    public function pendingPreApplications()
    {
        $result = $this->queryService->getPendingPreApplications();
        return $this->fromServiceResponse($result);
    }

    /**
     * Show application details
     */
    public function show(int $id)
    {
        $result = $this->queryService->show($id);
        return $this->fromServiceResponse($result);
    }

    /**
     * Approve pre-application
     */
    public function approvePreApplication(int $id, Request $request)
    {
        $adminId = $request->user()->id;
        $result = $this->preService->approvePreApplication($id, $adminId);
        return $this->fromServiceResponse($result);
    }

    /**
     * Approve full application
     */
    public function approveFullApplication(int $id, Request $request)
    {
        $adminId = $request->user()->id;
        $commissionPlanId = $request->input('commission_plan_id');
        $result = $this->fullService->approveFullApplication($id, $adminId, $commissionPlanId);
        return $this->fromServiceResponse($result);
    }

    /**
     * Reject pre-application
     */
    public function rejectPreApplication(int $id, RejectApplicationRequest $request)
    {
        $adminId = $request->user()->id;
        $result = $this->preService->rejectPreApplication(
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
        $result = $this->fullService->rejectFullApplication(
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
        $result = $this->fullService->approveVendorFullApplication($vendorId, $adminId, $commissionPlanId);
        return $this->fromServiceResponse($result);
    }

    /**
     * Reject vendor's full application (vendor-based endpoint)
     */
    public function rejectVendorFull(int $vendorId, RejectApplicationRequest $request)
    {
        $adminId = $request->user()->id;
        $result = $this->fullService->rejectVendorFullApplication(
            $vendorId,
            $adminId,
            $request->input('rejection_reason')
        );
        return $this->fromServiceResponse($result);
    }
}
