<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePreApplicationRequest;
use App\Http\Requests\SubmitFullApplicationRequest;
use App\Services\VendorApplicationService;
use App\Traits\ResponseHttp;

class VendorApplicationController extends Controller
{
    use ResponseHttp;

    protected VendorApplicationService $applicationService;

    public function __construct(VendorApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Submit pre-application (public endpoint)
     */
    public function store(StorePreApplicationRequest $request)
    {
        $result = $this->applicationService->submitPreApplication($request->validated());
        return $this->fromServiceResponse($result);
    }

    /**
     * Submit full application and create vendor account (public endpoint)
     */
    public function submitFull(SubmitFullApplicationRequest $request, int $preApplicationId)
    {
        $result = $this->applicationService->submitFullApplication($preApplicationId, $request->validated());
        return $this->fromServiceResponse($result);
    }
}
