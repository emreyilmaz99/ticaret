<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PublicRequests\FilterVendorProductsRequest;
use App\Http\Resources\Api\V1\Public\PublicVendorResource;
use App\Http\Resources\Api\V1\Public\PublicReviewResource;
use App\Interfaces\Services\Vendor\VendorServiceInterface;
use App\Traits\FormatsProductData;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;

class PublicVendorController extends Controller
{
    use FormatsProductData, ResponseHttp;
    
    public function __construct(
        protected VendorServiceInterface $vendorService
    ) {}
    /**
     * Get vendor profile by slug
     * GET /api/v1/vendors/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $result = $this->vendorService->getPublicProfile($slug);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }
        
        $vendorData = $result->getData();
        
        // Transform vendor using resource
        $data = [
            'vendor' => new PublicVendorResource($vendorData['vendor']),
            'stats' => $vendorData['stats'],
        ];

        return $this->success($data, 'Vendor profile retrieved');
    }

    /**
     * Get vendor products
     * GET /api/v1/vendors/{slug}/products
     */
    public function products(FilterVendorProductsRequest $request, string $slug): JsonResponse
    {
        $filters = [
            'category_id' => $request->input('category'),
            'search' => $request->input('search'),
            'has_discount' => $request->boolean('has_discount'),
            'min_price' => $request->input('min_price'),
            'max_price' => $request->input('max_price'),
            'sort' => $request->input('sort', 'newest'),
            'per_page' => 20,
        ];

        $result = $this->vendorService->getProducts($slug, $filters);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }
        
        $products = $result->getData();

        // Transform products with featured deal logic
        $transformedProducts = $products->map(function ($product) {
            $minPrice = $product->variants->min('price');
            $maxPrice = $product->variants->max('price');
            $totalStock = $product->variants->sum('stock');
            $mainPhoto = $product->photos->sortBy('sort_order')->first();
            
            // Get active featured deal
            $featuredDeal = $product->activeFeaturedDeal;
            $displayPrice = $featuredDeal ? $featuredDeal->deal_price : $minPrice;
            $originalPrice = $featuredDeal ? $featuredDeal->original_price : null;
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $displayPrice,
                'original_price' => $originalPrice,
                'discount_percentage' => $featuredDeal?->discount_percentage,
                'has_deal' => $featuredDeal !== null,
                'deal_badge' => $featuredDeal ? [
                    'text' => $featuredDeal->badge_text,
                    'color' => $featuredDeal->badge_color,
                ] : null,
                'price_range' => $minPrice !== $maxPrice ? [
                    'min' => $minPrice,
                    'max' => $maxPrice,
                ] : null,
                'has_variants' => $product->variants->isNotEmpty(),
                'stock' => $totalStock,
                'in_stock' => $totalStock > 0,
                'image' => $this->formatImageUrl($mainPhoto),
                'rating_avg' => $product->average_rating ?? 0,
                'review_count' => $product->review_count ?? 0,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ] : null,
            ];
        });

        $data = [
            'data' => $transformedProducts,
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ];

        return $this->success($data, 'Vendor products retrieved');
    }

    /**
     * Get vendor categories (categories that have products)
     * GET /api/v1/vendors/{slug}/categories
     */
    public function categories(string $slug): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->vendorService->getCategories($slug)
        );
    }

    /**
     * Get vendor reviews
     * GET /api/v1/vendors/{slug}/reviews
     */
    public function reviews(FilterVendorProductsRequest $request, string $slug): JsonResponse
    {
        $filters = [
            'rating' => $request->input('rating'),
            'sort_by' => $request->input('sort', 'newest'),
            'per_page' => 10,
        ];

        $result = $this->vendorService->getReviews($slug, $filters);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }
        
        $data = $result->getData();

        // Transform reviews using Resource
        $transformedReviews = PublicReviewResource::collection($data['reviews']);

        return $this->success([
            'data' => $transformedReviews,
            'summary' => $data['summary'],
            'meta' => [
                'current_page' => $data['reviews']->currentPage(),
                'last_page' => $data['reviews']->lastPage(),
                'per_page' => $data['reviews']->perPage(),
                'total' => $data['reviews']->total(),
            ],
        ], 'Vendor reviews retrieved');
    }
}
