<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Core\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Public\FeaturedDealResource;
use App\Models\FeaturedDeal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeaturedDealController extends Controller
{
    /**
     * Get current active featured deals
     */
    public function index(Request $request): JsonResponse
    {
        $deals = FeaturedDeal::with(['product.photos', 'product.vendor', 'variant'])
            ->current()
            ->ordered()
            ->get()
            ->each(function ($deal) {
                // Increment view count
                $deal->incrementViews();
            });

        $data = ['deals' => FeaturedDealResource::collection($deals)];

        return ApiResponse::success($data, 'Featured deals retrieved');
    }

    /**
     * Track click on a deal
     */
    public function click(FeaturedDeal $deal): JsonResponse
    {
        $deal->incrementClicks();

        return ApiResponse::success(null, 'Click tracked');
    }

    /**
     * Track conversion (when added to cart or purchased)
     */
    public function conversion(FeaturedDeal $deal): JsonResponse
    {
        $deal->incrementConversions();

        return ApiResponse::success(null, 'Conversion tracked');
    }
}
