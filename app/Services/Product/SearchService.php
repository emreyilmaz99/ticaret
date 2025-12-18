<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Product\SearchServiceInterface;
use App\Models\Product;
use App\Services\BaseService;

class SearchService extends BaseService implements SearchServiceInterface
{
    /**
     * Search products (for autocomplete)
     */
    public function searchProducts(string $query): ServiceResponse
    {
        try {
            if (empty($query) || strlen($query) < 2) {
                $data = [
                    'products' => [],
                    'popular_searches' => [
                        'iPhone',
                        'Samsung',
                        'Laptop',
                        'Kulaklık',
                        'Telefon Kılıfı'
                    ]
                ];
                
                return $this->successResponse($data, 'Popular searches');
            }

            // Elasticsearch search
            $products = Product::search($query)
                ->where('status', 'active')
                ->take(8)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'price' => $product->price,
                        'discount_price' => $product->discount_price,
                        'main_image' => $product->main_image,
                        'vendor' => [
                            'name' => $product->vendor->business_name ?? '',
                            'slug' => $product->vendor->slug ?? ''
                        ],
                        'rating' => $product->average_rating,
                        'review_count' => $product->review_count
                    ];
                });

            $data = [
                'products' => $products,
                'total' => $products->count()
            ];

            return $this->successResponse($data, 'Search results');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Search failed');
        }
    }
}
