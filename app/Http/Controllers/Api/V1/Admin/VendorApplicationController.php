<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectApplicationRequest;
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
        $filters = $request->only(['status', 'type']);
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
        $result = $this->applicationService->approveFullApplication($id, $adminId);
        return $this->fromServiceResponse($result);
    }

    /**
     * Reject application
     */
    public function reject(int $id, RejectApplicationRequest $request)
    {
        $adminId = $request->user()->id;
        $result = $this->applicationService->rejectApplication(
            $id,
            $adminId,
            $request->input('rejection_reason')
        );
        return $this->fromServiceResponse($result);
    }
}
