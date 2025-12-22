<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Vendor\StoreReviewResponseRequest;
use App\Http\Resources\Api\V1\Vendor\ReviewResource;
use App\Interfaces\Services\Review\VendorReviewResponseServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class VendorReviewController extends Controller
{
    use ResponseHttp;

    protected VendorReviewResponseServiceInterface $responseService;

    public function __construct(VendorReviewResponseServiceInterface $responseService)
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
        $perPage = $request->integer('per_page', 20);

        $result = $this->responseService->getProductReviews($vendor, $productId, $perPage);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $data = $result->getData();

        return $this->success([
            'reviews' => ReviewResource::collection($data['reviews']),
            'pagination' => $data['pagination'],
        ], $result->getMessage());
    }

    /**
     * GET /api/v1/vendor/reviews
     * List all reviews for vendor's products
     */
    public function allReviews(Request $request)
    {
        $vendor = $request->user();

        $filters = [
            'has_response' => $request->has('has_response') ? $request->boolean('has_response') : null,
            'rating' => $request->has('rating') ? $request->integer('rating') : null,
            'product_id' => $request->input('product_id'),
            'search' => $request->input('search'),
            'sort_by' => $request->input('sort_by', 'recent'),
        ];

        // Remove null values
        $filters = array_filter($filters, fn($value) => $value !== null);

        $perPage = $request->integer('per_page', 20);

        $result = $this->responseService->getAllVendorReviews($vendor, $filters, $perPage);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $data = $result->getData();

        return $this->success([
            'reviews' => ReviewResource::collection($data['reviews']),
            'pagination' => $data['pagination'],
        ], $result->getMessage());
    }

    /**
     * POST /api/v1/vendor/reviews/{reviewId}/response
     * Create a response to a review
     */
    public function storeResponse(Request $request, string $reviewId)
    {
        // Dynamic validation with StoreReviewResponseRequest
        $formRequest = app(StoreReviewResponseRequest::class);
        $formRequest->setContainer(app());
        $formRequest->setRedirector(app('redirect'));
        $formRequest->validateResolved();

        $vendor = $request->user();

        $result = $this->responseService->createResponse(
            $vendor,
            $reviewId,
            $request->input('response_text')
        );

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            $result->getData(),
            $result->getMessage(),
            201
        );
    }

    /**
     * DELETE /api/v1/vendor/review-responses/{responseId}
     * Soft delete vendor's response
     */
    public function destroyResponse(Request $request, string $responseId)
    {
        $vendor = $request->user();

        $result = $this->responseService->deleteResponse($vendor, $responseId);

        return $this->fromServiceResponse($result);
    }

    /**
     * GET /api/v1/vendor/review-stats
     * Get vendor's product review statistics
     */
    public function stats(Request $request)
    {
        $vendor = $request->user();

        return $this->fromServiceResponse(
            $this->responseService->getVendorReviewStats($vendor)
        );
    }
}
