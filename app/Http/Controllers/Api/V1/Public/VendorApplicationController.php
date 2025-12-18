<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PublicRequests\StorePreApplicationRequest;
use App\Interfaces\Services\Vendor\VendorApplicationPreServiceInterface;
use App\Interfaces\Services\Vendor\VendorApplicationQueryServiceInterface;
use App\Traits\ResponseHttp;

class VendorApplicationController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected VendorApplicationPreServiceInterface $preService,
        protected VendorApplicationQueryServiceInterface $queryService
    ) {}

    /**
     * Submit pre-application (public endpoint)
     */
    public function store(StorePreApplicationRequest $request)
    {
        $result = $this->preService->submitPreApplication($request->validated());
        return $this->fromServiceResponse($result);
    }

    /**
     * Get vendor application details (public endpoint)
     * Note: Full applications should be submitted via authenticated vendor endpoint
     */
    public function show(int $id)
    {
        $result = $this->queryService->show($id);
        return $this->fromServiceResponse($result);
    }
}
