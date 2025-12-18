<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\Product\UnitServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnitsController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected UnitServiceInterface $unitService
    ) {}

    public function index(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->unitService->list()
        );
    }
}
