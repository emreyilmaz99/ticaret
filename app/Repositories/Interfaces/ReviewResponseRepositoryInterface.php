<?php

namespace App\Repositories\Interfaces;

use App\Models\ReviewResponse;

interface ReviewResponseRepositoryInterface
{
    /**
     * Create review response
     */
    public function create(array $data): ReviewResponse;

    /**
     * Find response by id
     */
    public function find(int $id): ?ReviewResponse;

    /**
     * Find response by id for vendor
     */
    public function findForVendor(int $responseId, int $vendorId): ?ReviewResponse;

    /**
     * Find response by review id with trashed
     */
    public function findByReviewIdWithTrashed(int $reviewId): ?ReviewResponse;

    /**
     * Delete response
     */
    public function delete(int $id): bool;

    /**
     * Count responses for vendor products
     */
    public function countForVendorProducts(array $productIds): int;
}
