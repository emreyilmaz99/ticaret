<?php

namespace App\Services\Review;

use App\Core\ServiceResponse;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ReviewMedia;
use App\Models\User;
use App\Services\BaseService;
use App\Services\Media\ImageService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class ReviewService extends BaseService
{
    protected BannedWordService $bannedWordService;
    protected ImageService $imageService;

    public function __construct(BannedWordService $bannedWordService, ImageService $imageService)
    {
        $this->bannedWordService = $bannedWordService;
        $this->imageService = $imageService;
    }

    /**
     * Check if user can review product for this order item
     */
    public function canUserReviewProduct(User $user, int $orderId, int $orderItemId): ServiceResponse
    {
        // Check order exists and belongs to user
        $order = Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return $this->errorResponse('Sipariş bulunamadı', 404);
        }

        // Check order is delivered
        if ($order->status !== 'delivered') {
            return $this->errorResponse('Sadece teslim edilmiş siparişler için yorum yapabilirsiniz', 400);
        }

        // Check order item exists
        $orderItem = OrderItem::where('id', $orderItemId)
            ->where('order_id', $orderId)
            ->first();

        if (!$orderItem) {
            return $this->errorResponse('Sipariş kalemi bulunamadı', 404);
        }

        // Check if already reviewed (including soft deleted)
        $existingReview = ProductReview::withTrashed()
            ->where('order_item_id', $orderItemId)
            ->first();

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

            $orderItem = OrderItem::find($orderItemId);

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
            $review = ProductReview::create([
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
                
                foreach ($uploadedPaths as $index => $path) {
                    ReviewMedia::create([
                        'review_id' => $review->id,
                        'media_type' => 'photo',
                        'path' => $path,
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            $message = $status === 'rejected' 
                ? 'Yorumunuz uygunsuz kelimeler içerdiği için otomatik olarak reddedildi.'
                : 'Yorumunuz başarıyla gönderildi. Admin onayından sonra yayınlanacaktır.';

            return $this->successResponse([
                'review' => $review->load('media'),
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
            $review = ProductReview::where('id', $reviewId)
                ->where('user_id', $user->id)
                ->first();

            if (!$review) {
                return $this->errorResponse('Yorum bulunamadı', 404);
            }

            $review->delete();

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
            $query = ProductReview::with(['user', 'media', 'response.vendor'])
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
            $reviews = $query->paginate($perPage);

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
            $review = ProductReview::find($reviewId);

            if (!$review) {
                return $this->errorResponse('Yorum bulunamadı', 404);
            }

            if ($isHelpful) {
                $review->increment('helpful_count');
            } else {
                $review->increment('unhelpful_count');
            }

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
                $reviews = ProductReview::where('product_id', $productId)
                    ->where('status', 'approved')
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
            $orders = Order::where('user_id', $userId)
                ->with(['items.product.photos', 'items.review'])
                ->where('status', 'delivered')
                ->latest()
                ->get()
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
            $reviews = ProductReview::withTrashed()
                ->with(['product.photos', 'media', 'response.vendor'])
                ->where('user_id', $userId)
                ->latest()
                ->paginate($perPage);

            return $this->successResponse($reviews, 'Yorumlar getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorumlar alınamadı');
        }
    }

}
