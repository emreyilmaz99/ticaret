<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Services\PublicProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected PublicProductService $productService
    ) {}

    /**
     * Get public product listing with filters
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->productService->getProducts($request);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'data' => $result->getData(),
            'message' => $result->getMessage(),
        ], $result->getStatusCode());
    }

    /**
     * Get single product details
     */
    public function show(string $slug): JsonResponse
    {
        $result = $this->productService->getProductBySlug($slug);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'data' => $result->getData(),
            'message' => $result->getMessage(),
        ], $result->getStatusCode());
    }

    /**
     * Get related products
     */
    public function related(string $slug, Request $request): JsonResponse
    {
        $limit = min($request->get('limit', 4), 12);
        $result = $this->productService->getRelatedProducts($slug, $limit);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'data' => $result->getData(),
            'message' => $result->getMessage(),
        ], $result->getStatusCode());
    }

    /**
     * Get featured products
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = min($request->get('limit', 8), 20);
        $result = $this->productService->getFeaturedProducts($limit);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'data' => $result->getData(),
            'message' => $result->getMessage(),
        ], $result->getStatusCode());
    }
}
