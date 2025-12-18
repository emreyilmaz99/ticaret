<?php

namespace App\Interfaces\Services\Review;

use App\Core\ServiceResponse;
use App\Models\Vendor;

interface VendorReviewResponseServiceInterface
{
    public function canRespondToReview(Vendor $vendor, int $reviewId): ServiceResponse;
    public function createResponse(Vendor $vendor, int $reviewId, string $responseText): ServiceResponse;
    public function deleteResponse(Vendor $vendor, int $responseId): ServiceResponse;
    public function getProductReviews(Vendor $vendor, string $productId, int $perPage = 20): ServiceResponse;
    public function getAllVendorReviews(Vendor $vendor, array $filters = [], int $perPage = 20): ServiceResponse;
    public function getVendorReviewStats(Vendor $vendor): ServiceResponse;
}
