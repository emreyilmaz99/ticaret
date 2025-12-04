<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\SubmitFullApplicationRequest;
use App\Services\VendorApplicationService;

class ApplicationController extends BaseVendorController
{
    protected VendorApplicationService $applicationService;

    public function __construct(VendorApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Get current vendor's application status
     */
    public function status()
    {
        $vendor = request()->user();
        $result = $this->applicationService->getVendorApplicationStatus($vendor);
        return $this->fromServiceResponse($result);
    }

    /**
     * Submit full application (for vendors with pre_approved status)
     */
    public function submitFullApplication(SubmitFullApplicationRequest $request)
    {
        $vendor = request()->user();
        $result = $this->applicationService->submitFullApplication($vendor, $request->validated());
        return $this->fromServiceResponse($result);
    }
}
