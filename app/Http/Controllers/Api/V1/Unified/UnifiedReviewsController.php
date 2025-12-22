<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Http\Controllers\Controller;
use App\Http\Middleware\DetectUserType;
use App\Core\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Api\V1\Unified\StoreReviewRequest;
use App\Http\Requests\Api\V1\Unified\RejectReviewRequest;
use App\Http\Requests\Api\V1\Unified\BulkReviewActionRequest;

class UnifiedReviewsController extends Controller
{
    protected $userReviewController;
    protected $vendorReviewController;
    protected $adminReviewController;

    public function __construct(
        \App\Http\Controllers\Api\V1\User\UserReviewController $userReviewController,
        \App\Http\Controllers\Api\V1\Vendor\VendorReviewController $vendorReviewController,
        \App\Http\Controllers\Api\V1\Admin\AdminReviewController $adminReviewController
    ) {
        $this->userReviewController = $userReviewController;
        $this->vendorReviewController = $vendorReviewController;
        $this->adminReviewController = $adminReviewController;
    }

    /**
     * List reviews
     * 
     * GET /api/v1/reviews
     * - User: Gets their own reviews
     * - Vendor: Gets reviews for their products
     * - Admin: Gets all reviews
     */
    public function index(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'user' => $this->userReviewController->index($request),
            'vendor' => $this->vendorReviewController->allReviews($request),
            'admin' => $this->adminReviewController->index($request),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Get review statistics
     * 
     * GET /api/v1/reviews/stats
     * - User: Not available
     * - Vendor: Gets review stats for their products
     * - Admin: Gets all review stats
     */
    public function stats(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'vendor' => $this->vendorReviewController->stats($request),
            'admin' => $this->adminReviewController->stats(), // Doesn't need request
            'user' => ApiResponse::error('Statistics not available for users', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Create review (User only)
     * 
     * POST /api/v1/orders/{orderId}/items/{orderItemId}/review
     * 
     * @param StoreReviewRequest $request
     * @param int $orderId
     * @param int $orderItemId
     * @return mixed
     */
    public function store(StoreReviewRequest $request, int $orderId, int $orderItemId)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'user') {
            return ApiResponse::error('Only users can create reviews', 403);
        }
        
        /** @phpstan-ignore-next-line */
        return $this->userReviewController->store($request, $orderId, $orderItemId);
    }

    /**
     * Delete review
     * 
     * DELETE /api/v1/reviews/{reviewId}
     * - User: Can delete their own reviews
     * - Vendor: Cannot delete reviews
     * - Admin: Can delete any review
     */
    public function destroy(Request $request, int $reviewId)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'user' => $this->userReviewController->destroy($request, $reviewId),
            'admin' => ApiResponse::error('Use approve/reject endpoints for admin', 400),
            'vendor' => ApiResponse::error('Vendors cannot delete reviews', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Approve review (Admin only)
     * 
     * POST /api/v1/reviews/{id}/approve
     */
    public function approve(Request $request, int $id)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can approve reviews', 403);
        }

        return $this->adminReviewController->approve($id); // Only needs id
    }

    /**
     * Reject review (Admin only)
     * 
     * POST /api/v1/reviews/{id}/reject
     * 
     * @param RejectReviewRequest $request
     * @param int $id
     * @return mixed
     */
    public function reject(RejectReviewRequest $request, int $id)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can reject reviews', 403);
        }
        
        /** @phpstan-ignore-next-line */
        return $this->adminReviewController->reject($request, $id);
    }

    /**
     * Bulk approve reviews (Admin only)
     * 
     * POST /api/v1/reviews/bulk-approve
     * 
     * @param BulkReviewActionRequest $request
     * @return mixed
     */
    public function bulkApprove(BulkReviewActionRequest $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can bulk approve reviews', 403);
        }
        
        /** @phpstan-ignore-next-line */
        return $this->adminReviewController->bulkApprove($request);
    }

    /**
     * Bulk reject reviews (Admin only)
     * 
     * POST /api/v1/reviews/bulk-reject
     * 
     * @param BulkReviewActionRequest $request
     * @return mixed
     */
    public function bulkReject(BulkReviewActionRequest $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can bulk reject reviews', 403);
        }
        
        /** @phpstan-ignore-next-line */
        return $this->adminReviewController->bulkReject($request);
    }

    /**
     * Get reviewable orders (User only)
     * 
     * GET /api/v1/reviewable-orders
     */
    public function reviewableOrders(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'user') {
            return ApiResponse::error('Only users have reviewable orders', 403);
        }

        return $this->userReviewController->reviewableOrders($request);
    }

    /**
     * Add vendor response to review (Vendor only)
     * 
     * POST /api/v1/reviews/{reviewId}/response
     * 
     * @param Request $request
     * @param int $reviewId
     * @return mixed
     */
    public function storeResponse(Request $request, string $reviewId)
    {
        \Log::info('UnifiedReviewsController::storeResponse called', [
            'reviewId' => $reviewId,
            'all_input' => $request->all(),
        ]);
        
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'vendor') {
            return ApiResponse::error('Only vendors can respond to reviews', 403);
        }

        // Map 'response' to 'response_text' for compatibility
        if ($request->has('response') && !$request->has('response_text')) {
            $request->merge([
                'response_text' => $request->input('response')
            ]);
        }
        
        \Log::info('Before calling VendorReviewController', [
            'response_text' => $request->input('response_text'),
        ]);
        
        try {
            /** @phpstan-ignore-next-line */
            $result = $this->vendorReviewController->storeResponse($request, $reviewId);
            \Log::info('VendorReviewController returned', ['result' => 'success']);
            return $result;
        } catch (\Throwable $e) {
            \Log::error('VendorReviewController exception', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            throw $e;
        }
    }

    /**
     * Delete vendor response (Vendor only)
     * 
     * DELETE /api/v1/review-responses/{responseId}
     */
    public function destroyResponse(Request $request, int $responseId)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'vendor') {
            return ApiResponse::error('Only vendors can delete responses', 403);
        }

        return $this->vendorReviewController->destroyResponse($request, $responseId);
    }

    /**
     * Get trashed reviews (Admin only)
     * 
     * GET /api/v1/reviews/trashed
     */
    public function trashed(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can view trashed reviews', 403);
        }

        return $this->adminReviewController->trashed($request);
    }
}
