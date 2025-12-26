<?php

namespace App\Repositories;

use App\Models\ReviewMedia;
use App\Repositories\Interfaces\ReviewMediaRepositoryInterface;

class ReviewMediaRepository implements ReviewMediaRepositoryInterface
{
    public function __construct(
        protected ReviewMedia $model
    ) {}

    /**
     * Create review media
     */
    public function create(array $data): ReviewMedia
    {
        return $this->model->create($data);
    }

    /**
     * Bulk create review media
     */
    public function bulkCreate(int $reviewId, array $paths): void
    {
        $data = collect($paths)->map(fn($path, $index) => [
            'review_id' => $reviewId,
            'media_type' => 'photo',
            'path' => $path,
            'sort_order' => $index,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        $this->model->insert($data);
    }

    /**
     * Delete media for review
     */
    public function deleteForReview(int $reviewId): int
    {
        return $this->model->where('review_id', $reviewId)->delete();
    }

    /**
     * Find by review id
     */
    public function findByReviewId(int $reviewId): array
    {
        return $this->model->where('review_id', $reviewId)
            ->orderBy('sort_order')
            ->get()
            ->toArray();
    }
}
