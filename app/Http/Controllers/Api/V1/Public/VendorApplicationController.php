<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PublicRequests\StorePreApplicationRequest;
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
     * Get vendor application details (public endpoint)
     * Note: Full applications should be submitted via authenticated vendor endpoint
     */
    public function show(int $id)
    {
        $result = $this->applicationService->show($id);
        return $this->fromServiceResponse($result);
    }
}
