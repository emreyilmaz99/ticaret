<?php

namespace App\Services\Review;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Review\VendorReviewResponseServiceInterface;
use App\Models\Vendor;
use App\Repositories\Interfaces\ProductReviewRepositoryInterface;
use App\Repositories\Interfaces\ReviewResponseRepositoryInterface;
use App\Repositories\Interfaces\VendorRepositoryInterface;
use App\Services\BaseService;

class VendorReviewResponseService extends BaseService implements VendorReviewResponseServiceInterface
{
    public function __construct(
        protected ProductReviewRepositoryInterface $reviewRepo,
        protected ReviewResponseRepositoryInterface $responseRepo,
        protected VendorRepositoryInterface $vendorRepo,
        protected BannedWordService $bannedWordService
    ) {}

    /**
     * Check if vendor can respond to review
     */
    public function canRespondToReview(Vendor $vendor, int $reviewId): ServiceResponse
    {
        $review = $this->reviewRepo->find($reviewId);

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
        $existingResponse = $this->responseRepo->findByReviewIdWithTrashed($reviewId);

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

            $response = $this->responseRepo->create([
                'review_id' => $reviewId,
                'vendor_id' => $vendor->id,
                'response_text' => $responseText,
            ]);

            // Response zaten vendor bilgisini içeriyor (aynı vendor)
            return $this->successResponse(
                $response,
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
            $response = $this->responseRepo->findForVendor($responseId, $vendor->id);

            if (!$response) {
                return $this->errorResponse('Yanıt bulunamadı', 404);
            }

            $this->responseRepo->delete($responseId);

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
            $vendorProductIds = $this->vendorRepo->getProductIds($vendor->id);
            
            if (!in_array($productId, $vendorProductIds)) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            $reviews = $this->reviewRepo->getApprovedForProduct($productId, ['per_page' => $perPage]);

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
            $productIds = $this->vendorRepo->getProductIds($vendor->id);

            $reviews = $this->reviewRepo->getVendorProductReviews($productIds, $filters, $perPage);

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
            $productIds = $this->vendorRepo->getProductIds($vendor->id);

            $stats = $this->reviewRepo->getVendorStats($productIds);
            $stats['responded'] = $this->responseRepo->countForVendorProducts($productIds);

            return $this->successResponse($stats, 'Yorum istatistikleri başarıyla getirildi.');

        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler getirilemedi');
        }
    }
}
