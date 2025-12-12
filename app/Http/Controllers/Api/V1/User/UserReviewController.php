<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\StoreReviewRequest;
use App\Services\Review\ReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserReviewController extends Controller
{
    protected ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * Get user's reviewable orders
     * GET /api/v1/user/reviewable-orders
     */
    public function reviewableOrders(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $orders = $user->orders()
            ->with(['items.product', 'items.review'])
            ->where('status', 'delivered')
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'order_date' => $order->created_at->format('d.m.Y'),
                    'reviewable_items' => $order->items->filter(fn($item) => !$item->review)->map(fn($item) => [
                        'order_item_id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name,
                        'product_image' => $item->product->photos->first()?->path ?? null,
                    ])->values(),
                ];
            })
            ->filter(fn($order) => $order['reviewable_items']->isNotEmpty())
            ->values();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Create review for order item
     * POST /api/v1/orders/{orderId}/items/{orderItemId}/review
     */
    public function store(StoreReviewRequest $request, int $orderId, int $orderItemId): JsonResponse
    {
        $user = $request->user();
        $photos = $request->file('photos', []);

        $result = $this->reviewService->createReview(
            $user,
            $orderId,
            $orderItemId,
            $request->validated(),
            $photos
        );

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->isSuccess() ? 201 : 400);
    }

    /**
     * Get user's reviews
     * GET /api/v1/user/reviews
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $reviews = $user->reviews()
            ->withTrashed()
            ->with(['product.photos', 'media', 'response.vendor'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

    /**
     * Delete review (soft delete)
     * DELETE /api/v1/reviews/{reviewId}
     */
    public function destroy(Request $request, int $reviewId): JsonResponse
    {
        $user = $request->user();
        
        $result = $this->reviewService->deleteReview($user, $reviewId);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
        ], $result->isSuccess() ? 200 : 404);
    }
}
