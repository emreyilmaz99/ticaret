<?php

namespace App\Interfaces\Services\Product;

use App\Core\ServiceResponse;

interface FeaturedDealServiceInterface
{
    public function getActiveDeals(): ServiceResponse;
    public function trackClick(int $dealId): ServiceResponse;
    public function trackConversion(int $dealId): ServiceResponse;
}
