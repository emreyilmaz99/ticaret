<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PublicRequests\FilterVendorProductsRequest;
use App\Http\Resources\Api\V1\Shared\VendorResource;
use App\Interfaces\Services\Vendor\VendorServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;

class VendorController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected VendorServiceInterface $vendorService
    ) {}

    /**
     * Get vendor profile by slug
     */
    public function show(string $slug): JsonResponse
    {
        $result = $this->vendorService->getPublicProfile($slug);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }
        
        $data = $result->getData();
        $data['vendor'] = new VendorResource($data['vendor']);
        
        return $this->success($data, 'Vendor fetched');
    }

    /**
     * Get vendor products with filters
     */
    public function products(FilterVendorProductsRequest $request, string $slug): JsonResponse
    {
        $filters = [
            'category_id' => $request->input('category_id'),
            'search' => $request->input('search'),
            'min_price' => $request->input('min_price'),
            'max_price' => $request->input('max_price'),
            'filter' => $request->input('filter'),
            'sort_by' => $request->input('sort_by', 'newest'),
            'per_page' => $request->input('per_page', 20),
        ];

        $result = $this->vendorService->getProducts($slug, $filters);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }
        
        $products = $result->getData();
        
        // Add price info from variants
        $productsWithPrice = collect($products->items())->map(function($product) {
            $productArray = $product->toArray();
            
            $defaultVariant = $product->variants->first();
            if ($defaultVariant) {
                $productArray['price'] = $defaultVariant->price;
                $productArray['compare_at_price'] = $defaultVariant->compare_at_price;
            } else {
                $productArray['price'] = 0;
                $productArray['compare_at_price'] = null;
            }
            
            return $productArray;
        });
        
        $data = [
            'data' => $productsWithPrice,
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ];
        
        return $this->success($data, 'Vendor products fetched');
    }

    /**
     * Get vendor categories (categories of their products)
     */
    public function categories(string $slug): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->vendorService->getCategories($slug)
        );
    }

    /**
     * Get vendor reviews
     */
    public function reviews(FilterVendorProductsRequest $request, string $slug): JsonResponse
    {
        $filters = [
            'rating' => $request->input('rating'),
            'sort_by' => $request->input('sort_by', 'newest'),
            'per_page' => $request->input('per_page', 10),
        ];

        $result = $this->vendorService->getReviews($slug, $filters);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }
        
        $data = $result->getData();
        
        return $this->success([
            'data' => $data['reviews']->items(),
            'meta' => [
                'current_page' => $data['reviews']->currentPage(),
                'last_page' => $data['reviews']->lastPage(),
                'per_page' => $data['reviews']->perPage(),
                'total' => $data['reviews']->total(),
            ],
            'summary' => $data['summary']
        ], 'Vendor reviews fetched');
    }
}
