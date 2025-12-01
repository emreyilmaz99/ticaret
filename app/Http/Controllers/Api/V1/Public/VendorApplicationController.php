<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePreApplicationRequest;
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
}
