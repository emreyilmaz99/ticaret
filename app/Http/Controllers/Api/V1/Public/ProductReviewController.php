<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PublicRequests\VoteReviewRequest;
use App\Services\Review\ReviewService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    use ResponseHttp;
    
    protected ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * GET /api/v1/products/{productId}/reviews
     * List approved reviews for a product
     */
    public function index(Request $request, string $productId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->reviewService->getProductReviews($productId, [
                'rating' => $request->integer('rating'),
                'sort_by' => $request->input('sort_by', 'recent'),
                'per_page' => $request->integer('per_page', 20)
            ])
        );
    }

    /**
     * GET /api/v1/products/{productId}/review-summary
     * Get review statistics for a product
     */
    public function summary(string $productId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->reviewService->getSummary($productId)
        );
    }

    /**
     * POST /api/v1/reviews/{reviewId}/helpful
     * Vote a review as helpful or not helpful
     */
    public function voteHelpful(VoteReviewRequest $request, string $reviewId): JsonResponse
    {
        $isHelpful = $request->boolean('is_helpful');
        
        return $this->fromServiceResponse(
            $this->reviewService->voteHelpful($reviewId, $isHelpful)
        );
    }
}
