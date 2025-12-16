<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Ürün araması - autocomplete için
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        
        if (empty($query) || strlen($query) < 2) {
            return response()->json([
                'success' => true,
                'data' => [
                    'products' => [],
                    'popular_searches' => [
                        'iPhone',
                        'Samsung',
                        'Laptop',
                        'Kulaklık',
                        'Telefon Kılıfı'
                    ]
                ]
            ]);
        }

        // Elasticsearch ile arama
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

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $products,
                'total' => $products->count()
            ]
        ]);
    }
}
