<?php

namespace App\Repositories;

use App\Models\ProductReview;
use App\Repositories\Interfaces\ProductReviewRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ProductReviewRepository implements ProductReviewRepositoryInterface
{
    public function __construct(
        protected ProductReview $model
    ) {}

    /**
     * Get filtered reviews with pagination
     */
    public function getFiltered(array $filters): LengthAwarePaginator
    {
        $query = $this->model->with([
            'user',
            'product.vendor',
            'product.photos',
            'media',
            'response.vendor'
        ])
            ->when(isset($filters['status']), fn($q) => 
                $q->where('status', $filters['status'])
            )
            ->when(isset($filters['rating']), fn($q) => 
                $q->where('rating', $filters['rating'])
            )
            ->when($filters['search'] ?? null, function ($q) use ($filters) {
                $search = $filters['search'];
                $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('comment', 'like', "%{$search}%")
                        ->orWhereHas('user', fn($userQuery) => 
                            $userQuery->where('name', 'like', "%{$search}%")
                        );
                });
            })
            ->when($filters['with_trashed'] ?? false, fn($q) => 
                $q->withTrashed()
            )
            ->latest();

        return $query->paginate($filters['per_page'] ?? 50);
    }

    /**
     * Find review by ID
     */
    public function find(string $id, bool $withTrashed = false): ?ProductReview
    {
        $query = $withTrashed ? $this->model->withTrashed() : $this->model->query();
        
        return $query->with([
            'user',
            'product.vendor',
            'product.photos',
            'media',
            'response.vendor'
        ])->find($id);
    }

    /**
     * Bulk approve reviews
     */
    public function bulkApprove(array $reviewIds): int
    {
        return $this->model->whereIn('id', $reviewIds)
            ->where('status', '!=', 'approved')
            ->update([
                'status' => 'approved',
                'rejection_reason' => null
            ]);
    }

    /**
     * Bulk reject reviews
     */
    public function bulkReject(array $reviewIds, ?string $reason): int
    {
        return $this->model->whereIn('id', $reviewIds)
            ->where('status', '!=', 'rejected')
            ->update([
                'status' => 'rejected',
                'rejection_reason' => $reason
            ]);
    }

    /**
     * Approve single review
     */
    public function approve(string $id): ProductReview
    {
        $review = $this->model->findOrFail($id);
        $review->update([
            'status' => 'approved',
            'rejection_reason' => null
        ]);
        return $review->fresh();
    }

    /**
     * Reject single review
     */
    public function reject(string $id, string $reason): ProductReview
    {
        $review = $this->model->findOrFail($id);
        $review->update([
            'status' => 'rejected',
            'rejection_reason' => $reason
        ]);
        return $review->fresh();
    }

    /**
     * Soft delete review
     */
    public function delete(string $id): bool
    {
        $review = $this->model->findOrFail($id);
        return $review->delete();
    }

    /**
     * Bulk delete reviews
     */
    public function bulkDelete(array $reviewIds): int
    {
        return $this->model->whereIn('id', $reviewIds)->delete();
    }

    /**
     * Restore soft deleted review
     */
    public function restore(string $id): ProductReview
    {
        $review = $this->model->withTrashed()->findOrFail($id);
        $review->restore();
        return $review->fresh();
    }

    /**
     * Get product reviews
     */
    public function getProductReviews(string $productId, string $status = 'approved'): Collection
    {
        return $this->model->with(['user', 'media', 'response'])
            ->where('product_id', $productId)
            ->where('status', $status)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get user reviews
     */
    public function getUserReviews(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with(['product.photos', 'media'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get review statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => $this->model->count(),
            'pending' => $this->model->where('status', 'pending')->count(),
            'approved' => $this->model->where('status', 'approved')->count(),
            'rejected' => $this->model->where('status', 'rejected')->count(),
            'with_response' => $this->model->has('response')->count(),
            'avg_rating' => round($this->model->where('status', 'approved')->avg('rating'), 2),
        ];
    }

    /**
     * Check if user can review product
     */
    public function canUserReview(int $userId, string $productId): bool
    {
        // Check if user has purchased and hasn't reviewed yet
        return DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.user_id', $userId)
            ->where('order_items.product_id', $productId)
            ->where('orders.status', 'completed')
            ->whereNotExists(function ($query) use ($userId, $productId) {
                $query->select(DB::raw(1))
                    ->from('product_reviews')
                    ->where('user_id', $userId)
                    ->where('product_id', $productId);
            })
            ->exists();
    }

    /**
     * Create a new review
     */
    public function create(array $data): ProductReview
    {
        return $this->model->create($data);
    }

    /**
     * Find review by order item id with trashed
     */
    public function findByOrderItemIdWithTrashed(int $orderItemId): ?ProductReview
    {
        return $this->model->withTrashed()
            ->where('order_item_id', $orderItemId)
            ->first();
    }

    /**
     * Find review for user by id
     */
    public function findForUser(int $reviewId, int $userId): ?ProductReview
    {
        return $this->model
            ->where('id', $reviewId)
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Get approved reviews for product with pagination
     */
    public function getApprovedForProduct(int|string $productId, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->with(['user', 'media', 'response.vendor'])
            ->where('product_id', $productId)
            ->approved();

        // Filter by rating
        if (isset($filters['rating']) && $filters['rating'] > 0) {
            $query->where('rating', $filters['rating']);
        }

        // Sort
        $sort = $filters['sort_by'] ?? $filters['sort'] ?? 'recent';
        if ($sort === 'rating') {
            $query->orderBy('rating', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $filters['per_page'] ?? 20;
        return $query->paginate($perPage);
    }

    /**
     * Increment helpful count
     */
    public function incrementHelpful(string|int $reviewId): void
    {
        $this->model->where('id', $reviewId)->increment('helpful_count');
    }

    /**
     * Increment unhelpful count
     */
    public function incrementUnhelpful(string|int $reviewId): void
    {
        $this->model->where('id', $reviewId)->increment('unhelpful_count');
    }

    /**
     * Get review summary for product
     */
    public function getProductSummary(string $productId): array
    {
        $reviews = $this->model
            ->where('product_id', $productId)
            ->where('status', 'approved')
            ->get();

        $totalReviews = $reviews->count();
        $averageRating = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;

        $ratingBreakdown = [];
        for ($i = 1; $i <= 5; $i++) {
            $ratingBreakdown[$i] = $reviews->where('rating', $i)->count();
        }

        return [
            'total_reviews' => $totalReviews,
            'average_rating' => $averageRating,
            'rating_breakdown' => $ratingBreakdown,
        ];
    }

    /**
     * Get user reviews with trashed
     */
    public function getUserReviewsWithTrashed(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->withTrashed()
            ->with(['product.photos', 'media', 'response.vendor'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get reviews for vendor products
     */
    public function getVendorProductReviews(array $productIds, array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = $this->model->whereIn('product_id', $productIds)
            ->where('status', 'approved')
            ->with(['user', 'product.photos', 'media', 'response']);

        // Filter by response status
        if (isset($filters['has_response'])) {
            if ($filters['has_response']) {
                $query->has('response');
            } else {
                $query->doesntHave('response');
            }
        }

        // Filter by rating
        if (isset($filters['rating'])) {
            $query->where('rating', $filters['rating']);
        }

        // Filter by product
        if (isset($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }

        // Search
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('comment', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'recent';
        switch ($sortBy) {
            case 'oldest':
                $query->oldest();
                break;
            case 'highest':
                $query->orderBy('rating', 'desc');
                break;
            case 'lowest':
                $query->orderBy('rating', 'asc');
                break;
            default:
                $query->latest();
        }

        return $query->paginate($perPage);
    }

    /**
     * Get vendor review statistics
     */
    public function getVendorStats(array $productIds): array
    {
        $totalReviews = $this->model->whereIn('product_id', $productIds)->approved()->count();
        $avgRating = round($this->model->whereIn('product_id', $productIds)->approved()->avg('rating') ?? 0, 1);

        $ratingBreakdown = [];
        for ($i = 1; $i <= 5; $i++) {
            $ratingBreakdown[$i] = $this->model->whereIn('product_id', $productIds)
                ->approved()
                ->where('rating', $i)
                ->count();
        }

        $withMedia = $this->model->whereIn('product_id', $productIds)
            ->approved()
            ->has('media')
            ->count();

        $pendingResponses = $this->model->whereIn('product_id', $productIds)
            ->approved()
            ->doesntHave('response')
            ->count();

        return [
            'total_reviews' => $totalReviews,
            'average_rating' => $avgRating,
            'rating_breakdown' => $ratingBreakdown,
            'with_media' => $withMedia,
            'pending_responses' => $pendingResponses,
        ];
    }
}
