<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\StoreReviewRequest;
use App\Services\Review\ReviewService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserReviewController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected ReviewService $reviewService
    ) {}

    /**
     * Get user's reviewable orders
     * GET /api/v1/user/reviewable-orders
     */
    public function reviewableOrders(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->reviewService->getReviewableOrders($request->user()->id)
        );
    }

    /**
     * Create review for order item
     * POST /api/v1/orders/{orderId}/items/{orderItemId}/review
     */
    public function store(StoreReviewRequest $request, int $orderId, int $orderItemId): JsonResponse
    {
        $result = $this->reviewService->createReview(
            $request->user(),
            $orderId,
            $orderItemId,
            $request->validated(),
            $request->file('photos', [])
        );

        return $this->fromServiceResponse($result);
    }

    /**
     * Get user's reviews
     * GET /api/v1/user/reviews
     */
    public function index(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->reviewService->getUserReviews($request->user()->id, $request->integer('per_page', 10))
        );
    }

    /**
     * Delete review (soft delete)
     * DELETE /api/v1/reviews/{reviewId}
     */
    public function destroy(Request $request, int $reviewId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->reviewService->deleteReview($request->user(), $reviewId)
        );
    }
}
