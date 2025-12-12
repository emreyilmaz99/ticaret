<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Vendor\StoreReviewResponseRequest;
use App\Models\ProductReview;
use App\Models\ReviewResponse;
use App\Services\Review\VendorReviewResponseService;
use Illuminate\Http\Request;

class VendorReviewController extends Controller
{
    protected VendorReviewResponseService $responseService;

    public function __construct(VendorReviewResponseService $responseService)
    {
        $this->responseService = $responseService;
    }

    /**
     * GET /api/v1/vendor/products/{productId}/reviews
     * List reviews for vendor's products
     */
    public function index(Request $request, string $productId)
    {
        $vendor = $request->user();

        // Verify product belongs to vendor
        $product = $vendor->products()->findOrFail($productId);

        $reviews = ProductReview::where('product_id', $productId)
            ->approved()
            ->with(['user', 'media', 'response'])
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

    /**
     * GET /api/v1/vendor/reviews
     * List all reviews for vendor's products
     */
    public function allReviews(Request $request)
    {
        $vendor = $request->user();
        $productIds = $vendor->products()->pluck('id');

        $query = ProductReview::whereIn('product_id', $productIds)
            ->approved()
            ->with(['user', 'product', 'media', 'response']);

        // Filter by response status
        if ($request->has('has_response')) {
            if ($request->boolean('has_response')) {
                $query->has('response');
            } else {
                $query->doesntHave('response');
            }
        }

        // Filter by rating
        if ($request->has('rating')) {
            $query->where('rating', $request->integer('rating'));
        }

        // Filter by product
        if ($request->has('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('comment', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $sortBy = $request->input('sort_by', 'recent');
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

        $reviews = $query->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

    /**
     * POST /api/v1/vendor/reviews/{reviewId}/response
     * Create a response to a review
     */
    public function storeResponse(StoreReviewResponseRequest $request, string $reviewId)
    {
        $vendor = $request->user();

        $result = $this->responseService->createResponse(
            $vendor,
            $reviewId,
            $request->input('response_text')
        );

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->isSuccess() ? 201 : 400);
    }

    /**
     * DELETE /api/v1/vendor/review-responses/{responseId}
     * Soft delete vendor's response
     */
    public function destroyResponse(Request $request, string $responseId)
    {
        $vendor = $request->user();

        $result = $this->responseService->deleteResponse($vendor, $responseId);

        if (!$result->isSuccess()) {
            return response()->json([
                'success' => false,
                'message' => $result->getMessage(),
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => $result->getMessage(),
        ]);
    }

    /**
     * GET /api/v1/vendor/review-stats
     * Get vendor's product review statistics
     */
    public function stats(Request $request)
    {
        $vendor = $request->user();

        $productIds = $vendor->products()->pluck('id');

        $reviews = ProductReview::whereIn('product_id', $productIds)->approved();
        $totalReviews = $reviews->count();
        $avgRating = round($reviews->avg('rating') ?? 0, 1);

        // Rating breakdown
        $ratingBreakdown = [];
        for ($i = 1; $i <= 5; $i++) {
            $ratingBreakdown[$i] = ProductReview::whereIn('product_id', $productIds)
                ->approved()
                ->where('rating', $i)
                ->count();
        }

        // Reviews with media
        $withMedia = ProductReview::whereIn('product_id', $productIds)
            ->approved()
            ->has('media')
            ->count();

        $stats = [
            'total_reviews' => $totalReviews,
            'average_rating' => $avgRating,
            'pending_responses' => ProductReview::whereIn('product_id', $productIds)
                ->approved()
                ->doesntHave('response')
                ->count(),
            'responded' => ReviewResponse::whereHas('review', function ($query) use ($productIds) {
                $query->whereIn('product_id', $productIds);
            })->count(),
            'rating_breakdown' => $ratingBreakdown,
            'with_media' => $withMedia,
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
