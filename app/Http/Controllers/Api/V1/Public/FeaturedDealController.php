<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Interfaces\Services\Product\FeaturedDealServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeaturedDealController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected FeaturedDealServiceInterface $featuredDealService
    ) {}

    /**
     * Get current active featured deals
     */
    public function index(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->featuredDealService->getActiveDeals()
        );
    }

    /**
     * Track click on a deal
     */
    public function click(int $deal): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->featuredDealService->trackClick($deal)
        );
    }

    /**
     * Track conversion (when added to cart or purchased)
     */
    public function conversion(int $deal): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->featuredDealService->trackConversion($deal)
        );
    }
}
