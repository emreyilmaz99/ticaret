<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Vendor\SubmitFullApplicationRequest;
use App\Interfaces\Services\Vendor\VendorApplicationFullServiceInterface;
use App\Interfaces\Services\Vendor\VendorApplicationQueryServiceInterface;

class ApplicationController extends BaseVendorController
{
    public function __construct(
        protected VendorApplicationFullServiceInterface $fullService,
        protected VendorApplicationQueryServiceInterface $queryService
    ) {}

    /**
     * Get current vendor's application status
     */
    public function status()
    {
        $vendor = request()->user();
        $result = $this->queryService->getVendorApplicationStatus($vendor);
        return $this->fromServiceResponse($result);
    }

    /**
     * Submit full application (for vendors with pre_approved status)
     */
    public function submitFullApplication(SubmitFullApplicationRequest $request)
    {
        $vendor = request()->user();
        $result = $this->fullService->submitFullApplication($vendor, $request->validated());
        return $this->fromServiceResponse($result);
    }
}
