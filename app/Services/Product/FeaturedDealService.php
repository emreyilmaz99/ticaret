<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
use App\Http\Resources\Api\V1\Public\FeaturedDealResource;
use App\Interfaces\Services\Product\FeaturedDealServiceInterface;
use App\Repositories\FeaturedDealRepository;
use App\Services\BaseService;

class FeaturedDealService extends BaseService implements FeaturedDealServiceInterface
{
    public function __construct(
        protected FeaturedDealRepository $repo
    ) {}

    /**
     * Get current active featured deals
     */
    public function getActiveDeals(): ServiceResponse
    {
        try {
            $deals = $this->repo->getCurrentActive();
            
            // Increment view counts
            $deals->each(function ($deal) {
                $this->repo->incrementViews($deal->id);
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
            $this->repo->incrementClicks($dealId);

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
            $this->repo->incrementConversions($dealId);

            return $this->successResponse(null, 'Conversion tracked');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to track conversion');
        }
    }
}
