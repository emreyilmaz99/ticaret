<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\StoreReviewRequest;
use App\Http\Resources\Api\V1\User\ReviewResource;
use App\Interfaces\Services\Review\ReviewServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserReviewController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected ReviewServiceInterface $reviewService
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
    public function store(Request $request, string|int $orderId, string|int $orderItemId): JsonResponse
    {
        // Validate request using User-specific FormRequest
        $formRequest = app(StoreReviewRequest::class);
        $formRequest->setContainer(app());
        $formRequest->setRedirector(app('redirect'));
        $formRequest->validateResolved();

        $result = $this->reviewService->createReview(
            $request->user(),
            (int)$orderId,
            (int)$orderItemId,
            $request->all(),
            $request->file('photos', [])
        );

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $data = $result->getData();
        
        return $this->success(
            [
                'review' => new ReviewResource($data['review']),
                'status' => $data['status']
            ],
            $result->getMessage(),
            201
        );
    }

    /**
     * Get user's reviews
     * GET /api/v1/user/reviews
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->reviewService->getUserReviews($request->user()->id, $request->integer('per_page', 10));
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $reviews = $result->getData();

        return $this->success([
            'reviews' => ReviewResource::collection($reviews->items()),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ], $result->getMessage());
    }

    /**
     * Delete review (soft delete)
     * DELETE /api/v1/reviews/{reviewId}
     */
    public function destroy(Request $request, string|int $reviewId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->reviewService->deleteReview($request->user(), (int)$reviewId)
        );
    }
}
