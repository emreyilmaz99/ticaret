<?php

namespace App\Services\Review;

use App\Interfaces\Services\Review\ReviewServiceInterface;
use App\Core\ServiceResponse;
use App\Models\User;
use App\Repositories\Interfaces\ProductReviewRepositoryInterface;
use App\Repositories\Interfaces\ReviewMediaRepositoryInterface;
use App\Repositories\Interfaces\OrderItemRepositoryInterface;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Services\BaseService;
use App\Services\Media\ImageService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class ReviewService extends BaseService implements ReviewServiceInterface
{
    public function __construct(
        protected ProductReviewRepositoryInterface $reviewRepo,
        protected ReviewMediaRepositoryInterface $mediaRepo,
        protected OrderRepositoryInterface $orderRepo,
        protected OrderItemRepositoryInterface $orderItemRepo,
        protected BannedWordService $bannedWordService,
        protected ImageService $imageService
    ) {}

    /**
     * Check if user can review product for this order item
     */
    public function canUserReviewProduct(User $user, int $orderId, int $orderItemId): ServiceResponse
    {
        // Check order exists and belongs to user
        $order = $this->orderRepo->findForUser($orderId, $user->id);

        if (!$order) {
            return $this->errorResponse('Sipariş bulunamadı', 404);
        }

        // Check order is delivered
        if ($order->status !== 'delivered') {
            return $this->errorResponse('Sadece teslim edilmiş siparişler için yorum yapabilirsiniz', 400);
        }

        // Check order item exists
        $orderItem = $this->orderItemRepo->findForOrder($orderItemId, $orderId);

        if (!$orderItem) {
            return $this->errorResponse('Sipariş kalemi bulunamadı', 404);
        }

        // Check if already reviewed (including soft deleted)
        $existingReview = $this->reviewRepo->findByOrderItemIdWithTrashed($orderItemId);

        if ($existingReview) {
            return $this->errorResponse('Bu ürün için zaten yorum yaptınız', 400);
        }

        return $this->successResponse([
            'can_review' => true,
            'product_id' => $orderItem->product_id,
            'product_name' => $orderItem->product->name ?? 'Ürün',
        ]);
    }

    /**
     * Create a new review
     */
    public function createReview(User $user, int $orderId, int $orderItemId, array $data, array $photos = []): ServiceResponse
    {
        try {
            // Validate permission
            $canReview = $this->canUserReviewProduct($user, $orderId, $orderItemId);
            if (!$canReview->isSuccess()) {
                return $canReview;
            }

            $orderItem = $this->orderItemRepo->findForOrder($orderItemId, $orderId);

            // Check for banned words
            $bannedCheck = $this->bannedWordService->checkForBannedWords(
                $data['title'] . ' ' . $data['comment']
            );

            $status = 'pending';
            $rejectionReason = null;

            if ($bannedCheck['banned']) {
                $status = 'rejected';
                $rejectionReason = $bannedCheck['message'];
            }

            DB::beginTransaction();

            // Create review
            $review = $this->reviewRepo->create([
                'user_id' => $user->id,
                'product_id' => $orderItem->product_id,
                'order_id' => $orderId,
                'order_item_id' => $orderItemId,
                'rating' => $data['rating'],
                'title' => $data['title'],
                'comment' => $data['comment'],
                'is_anonymous' => $data['is_anonymous'] ?? false,
                'is_verified_purchase' => true,
                'status' => $status,
                'rejection_reason' => $rejectionReason,
            ]);

            // Upload photos if provided
            if (!empty($photos) && count($photos) <= 5) {
                $uploadedPaths = $this->imageService->uploadReviewPhotos($photos);
                $this->mediaRepo->bulkCreate($review->id, $uploadedPaths);
            }

            DB::commit();

            $message = $status === 'rejected' 
                ? 'Yorumunuz uygunsuz kelimeler içerdiği için otomatik olarak reddedildi.'
                : 'Yorumunuz başarıyla gönderildi. Admin onayından sonra yayınlanacaktır.';

            // Refresh review with media relation
            $review = $this->reviewRepo->find($review->id);

            return $this->successResponse([
                'review' => $review,
                'status' => $status,
            ], $message);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e, 'Yorum oluşturulamadı');
        }
    }

    /**
     * Delete review (soft delete)
     */
    public function deleteReview(User $user, int $reviewId): ServiceResponse
    {
        try {
            $review = $this->reviewRepo->findForUser($reviewId, $user->id);

            if (!$review) {
                return $this->errorResponse('Yorum bulunamadı', 404);
            }

            $this->reviewRepo->delete($reviewId);

            return $this->successResponse(null, 'Yorum silindi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorum silinemedi');
        }
    }

    /**
     * Get product reviews with filters
     */
    public function getProductReviews(string|int $productId, array $filters = []): ServiceResponse
    {
        try {
            $reviews = $this->reviewRepo->getApprovedForProduct($productId, $filters);

            return $this->successResponse($reviews);

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorumlar alınamadı');
        }
    }

    /**
     * Vote a review as helpful or not helpful
     */
    public function voteHelpful(string|int $reviewId, bool $isHelpful): ServiceResponse
    {
        try {
            $review = $this->reviewRepo->find($reviewId);

            if (!$review) {
                return $this->errorResponse('Yorum bulunamadı', 404);
            }

            if ($isHelpful) {
                $this->reviewRepo->incrementHelpful($reviewId);
            } else {
                $this->reviewRepo->incrementUnhelpful($reviewId);
            }

            $review = $this->reviewRepo->find($reviewId);

            $data = [
                'helpful_count' => $review->helpful_count,
                'unhelpful_count' => $review->unhelpful_count,
            ];

            return $this->successResponse($data, 'Oyunuz kaydedildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Oy kaydedilemedi');
        }
    }

    /**
     * Get review summary/statistics for a product
     */
    public function getSummary(string $productId): ServiceResponse
    {
        try {
            $cacheKey = "product:{$productId}:review_summary";

            $summary = Cache::remember($cacheKey, 600, function () use ($productId) {
                return $this->reviewRepo->getProductSummary($productId);
            });

            return $this->successResponse($summary, 'Yorum özeti getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorum özeti alınamadı');
        }
    }

    /**
     * Get reviewable orders for user
     */
    public function getReviewableOrders(int $userId): ServiceResponse
    {
        try {
            $orders = $this->orderRepo->getDeliveredForUserWithItems($userId)
                ->map(function ($order) {
                    $reviewableItems = $order->items
                        ->filter(fn($item) => !$item->review)
                        ->map(fn($item) => [
                            'order_item_id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product->name,
                            'product_image' => $item->product->photos->first()?->path ?? null,
                        ])
                        ->values();

                    return [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'order_date' => $order->created_at->format('d.m.Y'),
                        'reviewable_items' => $reviewableItems,
                    ];
                })
                ->filter(fn($order) => $order['reviewable_items']->isNotEmpty())
                ->values();

            return $this->successResponse($orders, 'Değerlendirilebilir siparişler getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Değerlendirilebilir siparişler alınamadı');
        }
    }

    /**
     * Get user's reviews
     */
    public function getUserReviews(int $userId, int $perPage = 10): ServiceResponse
    {
        try {
            $reviews = $this->reviewRepo->getUserReviewsWithTrashed($userId, $perPage);

            return $this->successResponse($reviews, 'Yorumlar getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorumlar alınamadı');
        }
    }

}
