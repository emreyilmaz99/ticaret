<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use App\Services\Review\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductReviewController extends Controller
{
    protected ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * GET /api/v1/products/{productId}/reviews
     * List approved reviews for a product
     */
    public function index(Request $request, string $productId)
    {
        $result = $this->reviewService->getProductReviews($productId, [
            'rating' => $request->integer('rating'),
            'sort_by' => $request->input('sort_by', 'recent'),
            'per_page' => $request->integer('per_page', 20)
        ]);

        if (!$result->isSuccess()) {
            return response()->json([
                'success' => false,
                'message' => $result->getMessage(),
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result->getData(),
        ]);
    }

    /**
     * GET /api/v1/products/{productId}/review-summary
     * Get review statistics for a product
     */
    public function summary(string $productId)
    {
        $cacheKey = "product:{$productId}:review_summary";

        $summary = Cache::remember($cacheKey, 600, function () use ($productId) {
            $reviews = ProductReview::where('product_id', $productId)
                ->approved()
                ->get();

            $totalReviews = $reviews->count();
            $averageRating = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;

            // Rating breakdown
            $ratingBreakdown = [];
            for ($i = 1; $i <= 5; $i++) {
                $ratingBreakdown[$i] = $reviews->where('rating', $i)->count();
            }

            return [
                'total_reviews' => $totalReviews,
                'average_rating' => $averageRating,
                'rating_breakdown' => $ratingBreakdown,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }

    /**
     * POST /api/v1/reviews/{reviewId}/helpful
     * Vote a review as helpful or not helpful
     */
    public function voteHelpful(Request $request, string $reviewId)
    {
        $request->validate([
            'is_helpful' => 'required|boolean',
        ]);

        $review = ProductReview::findOrFail($reviewId);
        $isHelpful = $request->boolean('is_helpful');

        if ($isHelpful) {
            $review->increment('helpful_count');
        } else {
            $review->increment('unhelpful_count');
        }

        return response()->json([
            'success' => true,
            'message' => 'Oyunuz kaydedildi.',
            'data' => [
                'helpful_count' => $review->helpful_count,
                'unhelpful_count' => $review->unhelpful_count,
            ],
        ]);
    }
}
