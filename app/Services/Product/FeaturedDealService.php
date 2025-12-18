<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
use App\Http\Resources\Api\V1\Public\FeaturedDealResource;
use App\Interfaces\Services\Product\FeaturedDealServiceInterface;
use App\Models\FeaturedDeal;
use App\Services\BaseService;

class FeaturedDealService extends BaseService implements FeaturedDealServiceInterface
{
    /**
     * Get current active featured deals
     */
    public function getActiveDeals(): ServiceResponse
    {
        try {
            $deals = FeaturedDeal::with(['product.photos', 'product.vendor', 'variant'])
                ->current()
                ->ordered()
                ->get()
                ->each(function ($deal) {
                    // Increment view count
                    $deal->incrementViews();
                });

            $data = ['deals' => FeaturedDealResource::collection($deals)];

            return $this->successResponse($data, 'Featured deals retrieved');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to retrieve featured deals');
        }
    }

    /**
     * Track click on a deal
     */
    public function trackClick(int $dealId): ServiceResponse
    {
        try {
            $deal = FeaturedDeal::findOrFail($dealId);
            $deal->incrementClicks();

            return $this->successResponse(null, 'Click tracked');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to track click');
        }
    }

    /**
     * Track conversion (when added to cart or purchased)
     */
    public function trackConversion(int $dealId): ServiceResponse
    {
        try {
            $deal = FeaturedDeal::findOrFail($dealId);
            $deal->incrementConversions();

            return $this->successResponse(null, 'Conversion tracked');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to track conversion');
        }
    }
}
