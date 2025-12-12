<?php

namespace App\Services\Review;

use App\Core\ServiceResponse;
use App\Models\ProductReview;
use App\Models\ReviewResponse;
use App\Models\Vendor;
use App\Services\BaseService;

class VendorReviewResponseService extends BaseService
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
}
