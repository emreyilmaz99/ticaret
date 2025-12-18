<?php

namespace App\Services\Review;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Review\VendorReviewResponseServiceInterface;
use App\Models\ProductReview;
use App\Models\ReviewResponse;
use App\Models\Vendor;
use App\Services\BaseService;

class VendorReviewResponseService extends BaseService implements VendorReviewResponseServiceInterface
{
    protected BannedWordService $bannedWordService;

    public function __construct(BannedWordService $bannedWordService)
    {
        $this->bannedWordService = $bannedWordService;
    }

    /**
     * Check if vendor can respond to review
     */
    public function canRespondToReview(Vendor $vendor, int $reviewId): ServiceResponse
    {
        $review = ProductReview::with('product')->find($reviewId);

        if (!$review) {
            return $this->errorResponse('Yorum bulunamadı', 404);
        }

        // Check if product belongs to vendor
        if ($review->product->vendor_id !== $vendor->id) {
            return $this->errorResponse('Bu yoruma yanıt verme yetkiniz yok', 403);
        }

        // Check if review is approved
        if ($review->status !== 'approved') {
            return $this->errorResponse('Sadece onaylanmış yorumlara yanıt verebilirsiniz', 400);
        }

        // Check if response already exists
        $existingResponse = ReviewResponse::withTrashed()
            ->where('review_id', $reviewId)
            ->first();

        if ($existingResponse) {
            return $this->errorResponse('Bu yorum için zaten yanıt verilmiş', 400);
        }

        return $this->successResponse(['can_respond' => true]);
    }

    /**
     * Create vendor response to review
     */
    public function createResponse(Vendor $vendor, int $reviewId, string $responseText): ServiceResponse
    {
        try {
            // Validate permission
            $canRespond = $this->canRespondToReview($vendor, $reviewId);
            if (!$canRespond->isSuccess()) {
                return $canRespond;
            }

            // Check for banned words
            $bannedCheck = $this->bannedWordService->checkForBannedWords($responseText);

            if ($bannedCheck['banned']) {
                return $this->errorResponse($bannedCheck['message'], 400);
            }

            $response = ReviewResponse::create([
                'review_id' => $reviewId,
                'vendor_id' => $vendor->id,
                'response_text' => $responseText,
            ]);

            return $this->successResponse(
                $response->load('vendor'),
                'Yanıt başarıyla gönderildi'
            );

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yanıt gönderilemedi');
        }
    }

    /**
     * Delete vendor response (soft delete)
     */
    public function deleteResponse(Vendor $vendor, int $responseId): ServiceResponse
    {
        try {
            $response = ReviewResponse::where('id', $responseId)
                ->where('vendor_id', $vendor->id)
                ->first();

            if (!$response) {
                return $this->errorResponse('Yanıt bulunamadı', 404);
            }

            $response->delete();

            return $this->successResponse(null, 'Yanıt silindi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yanıt silinemedi');
        }
    }

    /**
     * Get reviews for a specific vendor product
     */
    public function getProductReviews(Vendor $vendor, string $productId, int $perPage = 20): ServiceResponse
    {
        try {
            // Verify product belongs to vendor
            $product = $vendor->products()->findOrFail($productId);

            $reviews = ProductReview::where('product_id', $productId)
                ->approved()
                ->with(['user', 'media', 'response'])
                ->latest()
                ->paginate($perPage);

            return $this->successResponse([
                'reviews' => $reviews->items(),
                'pagination' => [
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                    'per_page' => $reviews->perPage(),
                    'total' => $reviews->total(),
                ],
            ], 'Ürün yorumları başarıyla getirildi.');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorumlar getirilemedi');
        }
    }

    /**
     * Get all reviews for vendor's products with filters
     */
    public function getAllVendorReviews(Vendor $vendor, array $filters = [], int $perPage = 20): ServiceResponse
    {
        try {
            $productIds = $vendor->products()->pluck('id');

            $query = ProductReview::whereIn('product_id', $productIds)
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

            $reviews = $query->paginate($perPage);

            return $this->successResponse([
                'reviews' => $reviews->items(),
                'pagination' => [
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                    'per_page' => $reviews->perPage(),
                    'total' => $reviews->total(),
                ],
            ], 'Yorumlar başarıyla getirildi.');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorumlar getirilemedi');
        }
    }

    /**
     * Get review statistics for vendor's products
     */
    public function getVendorReviewStats(Vendor $vendor): ServiceResponse
    {
        try {
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

            return $this->successResponse($stats, 'Yorum istatistikleri başarıyla getirildi.');

        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler getirilemedi');
        }
    }
}
