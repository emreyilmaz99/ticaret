<?php

namespace App\Repositories\Interfaces;

use App\Models\ProductReview;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ProductReviewRepositoryInterface
{
    /**
     * Get filtered reviews with pagination
     */
    public function getFiltered(array $filters): LengthAwarePaginator;

    /**
     * Find review by ID
     */
    public function find(string $id, bool $withTrashed = false): ?ProductReview;

    /**
     * Bulk approve reviews
     */
    public function bulkApprove(array $reviewIds): int;

    /**
     * Bulk reject reviews
     */
    public function bulkReject(array $reviewIds, ?string $reason): int;

    /**
     * Approve single review
     */
    public function approve(string $id): ProductReview;

    /**
     * Reject single review
     */
    public function reject(string $id, string $reason): ProductReview;

    /**
     * Soft delete review
     */
    public function delete(string $id): bool;

    /**
     * Bulk delete reviews
     */
    public function bulkDelete(array $reviewIds): int;

    /**
     * Restore soft deleted review
     */
    public function restore(string $id): ProductReview;

    /**
     * Get product reviews
     */
    public function getProductReviews(string $productId, string $status = 'approved'): Collection;

    /**
     * Get user reviews
     */
    public function getUserReviews(int $userId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get review statistics
     */
    public function getStatistics(): array;

    /**
     * Check if user can review product
     */
    public function canUserReview(int $userId, string $productId): bool;

    /**
     * Create a new review
     */
    public function create(array $data): ProductReview;

    /**
     * Find review by order item id with trashed
     */
    public function findByOrderItemIdWithTrashed(int $orderItemId): ?ProductReview;

    /**
     * Find review for user by id
     */
    public function findForUser(int $reviewId, int $userId): ?ProductReview;

    /**
     * Get approved reviews for product with pagination
     */
    public function getApprovedForProduct(int|string $productId, array $filters = []): LengthAwarePaginator;

    /**
     * Increment helpful count
     */
    public function incrementHelpful(string|int $reviewId): void;

    /**
     * Increment unhelpful count
     */
    public function incrementUnhelpful(string|int $reviewId): void;

    /**
     * Get review summary for product
     */
    public function getProductSummary(string $productId): array;

    /**
     * Get user reviews with trashed
     */
    public function getUserReviewsWithTrashed(int $userId, int $perPage = 10): LengthAwarePaginator;

    /**
     * Get reviews for vendor products
     */
    public function getVendorProductReviews(array $productIds, array $filters = [], int $perPage = 20): LengthAwarePaginator;

    /**
     * Get vendor review statistics
     */
    public function getVendorStats(array $productIds): array;
}
