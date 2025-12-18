<?php

namespace App\Interfaces\Services\Review;

use App\Core\ServiceResponse;
use App\Models\User;

interface ReviewServiceInterface
{
    /**
     * Check if user can review product
     */
    public function canUserReviewProduct(User $user, int $orderId, int $orderItemId): ServiceResponse;

    /**
     * Create review
     */
    public function createReview(User $user, int $orderId, int $orderItemId, array $data, array $photos): ServiceResponse;

    /**
     * Delete review
     */
    public function deleteReview(User $user, int $reviewId): ServiceResponse;

    /**
     * Get product reviews
     */
    public function getProductReviews(string|int $productId, array $filters): ServiceResponse;

    /**
     * Vote helpful
     */
    public function voteHelpful(string|int $reviewId, bool $isHelpful): ServiceResponse;

    /**
     * Get review summary
     */
    public function getSummary(string $productId): ServiceResponse;

    /**
     * Get reviewable orders
     */
    public function getReviewableOrders(int $userId): ServiceResponse;

    /**
     * Get user reviews
     */
    public function getUserReviews(int $userId, int $perPage = 10): ServiceResponse;
}
