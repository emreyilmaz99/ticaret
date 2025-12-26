<?php

namespace App\Repositories;

use App\Models\ReviewResponse;
use App\Repositories\Interfaces\ReviewResponseRepositoryInterface;

class ReviewResponseRepository implements ReviewResponseRepositoryInterface
{
    public function __construct(
        protected ReviewResponse $model
    ) {}

    /**
     * Create review response
     */
    public function create(array $data): ReviewResponse
    {
        return $this->model->create($data);
    }

    /**
     * Find response by id
     */
    public function find(int $id): ?ReviewResponse
    {
        return $this->model->find($id);
    }

    /**
     * Find response by id for vendor
     */
    public function findForVendor(int $responseId, int $vendorId): ?ReviewResponse
    {
        return $this->model
            ->where('id', $responseId)
            ->where('vendor_id', $vendorId)
            ->first();
    }

    /**
     * Find response by review id with trashed
     */
    public function findByReviewIdWithTrashed(int $reviewId): ?ReviewResponse
    {
        return $this->model->withTrashed()
            ->where('review_id', $reviewId)
            ->first();
    }

    /**
     * Delete response
     */
    public function delete(int $id): bool
    {
        $response = $this->model->find($id);
        return $response ? $response->delete() : false;
    }

    /**
     * Count responses for vendor products
     */
    public function countForVendorProducts(array $productIds): int
    {
        return $this->model->whereHas('review', function ($query) use ($productIds) {
            $query->whereIn('product_id', $productIds);
        })->count();
    }
}
