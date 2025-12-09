<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Services\Product\PublicProductService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected PublicProductService $productService
    ) {}

    /**
     * Get public product listing with filters
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->productService->getProducts($request);
        return $this->fromServiceResponse($result);
    }

    /**
     * Get single product details
     */
    public function show(string $slug): JsonResponse
    {
        $result = $this->productService->getProductBySlug($slug);
        return $this->fromServiceResponse($result);
    }

    /**
     * Get related products
     */
    public function related(string $slug, Request $request): JsonResponse
    {
        $limit = min($request->get('limit', 4), 12);
        $result = $this->productService->getRelatedProducts($slug, $limit);
        return $this->fromServiceResponse($result);
    }

    /**
     * Get featured products
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = min($request->get('limit', 8), 20);
        $result = $this->productService->getFeaturedProducts($limit);
        return $this->fromServiceResponse($result);
    }

    /**
     * Get main categories with product counts
     */
    public function categories(): JsonResponse
    {
        $result = $this->productService->getMainCategories();
        return $this->fromServiceResponse($result);
    }
}
