<?php

namespace App\Repositories\Interfaces;

use App\Models\ReviewMedia;

interface ReviewMediaRepositoryInterface
{
    /**
     * Create review media
     */
    public function create(array $data): ReviewMedia;

    /**
     * Bulk create review media
     */
    public function bulkCreate(int $reviewId, array $paths): void;

    /**
     * Delete media for review
     */
    public function deleteForReview(int $reviewId): int;

    /**
     * Find by review id
     */
    public function findByReviewId(int $reviewId): array;
}
