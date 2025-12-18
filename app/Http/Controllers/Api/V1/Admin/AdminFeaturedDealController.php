<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\ReorderFeaturedDealsRequest;
use App\Http\Requests\Api\V1\Admin\StoreFeaturedDealRequest;
use App\Http\Requests\Api\V1\Admin\UpdateFeaturedDealRequest;
use App\Interfaces\Services\Admin\AdminFeaturedDealServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFeaturedDealController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected AdminFeaturedDealServiceInterface $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = [
            'status' => $request->input('status'),
            'per_page' => $request->input('per_page', 15),
        ];

        return $this->fromServiceResponse($this->service->list($filters));
    }

    public function create(): JsonResponse
    {
        return $this->fromServiceResponse($this->service->getProductsForCreate());
    }

    public function store(StoreFeaturedDealRequest $request): JsonResponse
    {
        return $this->fromServiceResponse($this->service->create($request->validated()));
    }

    public function show(int $dealId): JsonResponse
    {
        return $this->fromServiceResponse($this->service->find($dealId));
    }

    public function update(UpdateFeaturedDealRequest $request, int $dealId): JsonResponse
    {
        return $this->fromServiceResponse($this->service->update($dealId, $request->validated()));
    }

    public function destroy(int $dealId): JsonResponse
    {
        return $this->fromServiceResponse($this->service->delete($dealId));
    }

    public function toggle(int $dealId): JsonResponse
    {
        return $this->fromServiceResponse($this->service->toggle($dealId));
    }

    public function reorder(ReorderFeaturedDealsRequest $request): JsonResponse
    {
        return $this->fromServiceResponse($this->service->reorder($request->validated()['deals']));
    }
}
