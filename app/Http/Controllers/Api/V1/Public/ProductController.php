<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get public product listing with filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['variants', 'photos', 'category', 'vendor:id,name,slug'])
            ->where('status', 'active')
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'));

        // Category filter
        if ($request->filled('category_id')) {
            $categoryId = $request->category_id;
            // Include subcategories
            $categoryIds = Category::where('id', $categoryId)
                ->orWhere('parent_id', $categoryId)
                ->pluck('id');
            $query->whereIn('category_id', $categoryIds);
        }

        if ($request->filled('category_slug')) {
            $category = Category::where('slug', $request->category_slug)->first();
            if ($category) {
                $categoryIds = Category::where('id', $category->id)
                    ->orWhere('parent_id', $category->id)
                    ->pluck('id');
                $query->whereIn('category_id', $categoryIds);
            }
        }

        // Price filter
        if ($request->filled('min_price')) {
            $query->whereHas('variants', fn($q) => $q->where('price', '>=', $request->min_price));
        }
        if ($request->filled('max_price')) {
            $query->whereHas('variants', fn($q) => $q->where('price', '<=', $request->max_price));
        }

        // Featured filter
        if ($request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'price_asc':
                $query->orderByRaw('(SELECT MIN(price) FROM product_variants WHERE product_variants.product_id = products.id) ASC');
                break;
            case 'price_desc':
                $query->orderByRaw('(SELECT MIN(price) FROM product_variants WHERE product_variants.product_id = products.id) DESC');
                break;
            case 'name':
                $query->orderBy('name', $sortOrder);
                break;
            case 'featured':
                $query->orderBy('is_featured', 'desc')->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $perPage = min($request->get('per_page', 12), 50);
        $products = $query->paginate($perPage);

        // Transform products for frontend
        $transformedProducts = $products->getCollection()->map(function ($product) {
            $minPrice = $product->variants->min('price');
            $maxPrice = $product->variants->max('price');
            $totalStock = $product->variants->sum('stock');
            $mainPhoto = $product->photos->sortBy('sort_order')->first();

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'short_description' => $product->short_description,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,
                'vendor' => $product->vendor ? [
                    'id' => $product->vendor->id,
                    'name' => $product->vendor->name,
                    'slug' => $product->vendor->slug,
                ] : null,
                'price' => $minPrice,
                'price_range' => $minPrice !== $maxPrice ? [
                    'min' => $minPrice,
                    'max' => $maxPrice,
                ] : null,
                'stock' => $totalStock,
                'in_stock' => $totalStock > 0,
                'image' => $mainPhoto ? ($mainPhoto->url ?: asset('storage/' . $mainPhoto->path)) : null,
                'images' => $product->photos->sortBy('sort_order')->map(fn($p) => $p->url ?: asset('storage/' . $p->path))->values(),
                'is_featured' => $product->is_featured,
                'variants_count' => $product->variants->count(),
                'rating' => 4.5, // TODO: Implement ratings
                'reviews_count' => 0, // TODO: Implement reviews
                'created_at' => $product->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $transformedProducts,
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ],
            ],
        ]);
    }

    /**
     * Get single product details
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::with(['variants.unit', 'photos', 'category.parent', 'vendor:id,name,slug'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->firstOrFail();

        $minPrice = $product->variants->min('price');
        $maxPrice = $product->variants->max('price');

        return response()->json([
            'success' => true,
            'data' => [
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'sku' => $product->sku,
                    'short_description' => $product->short_description,
                    'description' => $product->description,
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                        'slug' => $product->category->slug,
                        'parent' => $product->category->parent ? [
                            'id' => $product->category->parent->id,
                            'name' => $product->category->parent->name,
                            'slug' => $product->category->parent->slug,
                        ] : null,
                    ] : null,
                    'vendor' => $product->vendor ? [
                        'id' => $product->vendor->id,
                        'name' => $product->vendor->name,
                        'slug' => $product->vendor->slug,
                    ] : null,
                    'price' => $minPrice,
                    'price_range' => $minPrice !== $maxPrice ? [
                        'min' => $minPrice,
                        'max' => $maxPrice,
                    ] : null,
                    'variants' => $product->variants->map(fn($v) => [
                        'id' => $v->id,
                        'sku' => $v->sku,
                        'title' => $v->title,
                        'price' => $v->price,
                        'stock' => $v->stock,
                        'in_stock' => $v->stock > 0,
                        'unit' => $v->unit ? $v->unit->symbol : null,
                        'weight' => $v->weight,
                    ]),
                    'images' => $product->photos->sortBy('sort_order')->map(fn($p) => [
                        'id' => $p->id,
                        'url' => $p->url ?: asset('storage/' . $p->path),
                        'alt' => $p->alt,
                    ])->values(),
                    'is_featured' => $product->is_featured,
                    'rating' => 4.5, // TODO: Implement ratings
                    'reviews_count' => 0, // TODO: Implement reviews
                    'created_at' => $product->created_at,
                ],
            ],
        ]);
    }

    /**
     * Get featured products
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = min($request->get('limit', 8), 20);

        $products = Product::with(['variants', 'photos', 'category'])
            ->where('status', 'active')
            ->where('is_featured', true)
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        $transformedProducts = $products->map(function ($product) {
            $minPrice = $product->variants->min('price');
            $mainPhoto = $product->photos->sortBy('sort_order')->first();

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->category?->name,
                'price' => $minPrice,
                'image' => $mainPhoto ? ($mainPhoto->url ?: asset('storage/' . $mainPhoto->path)) : null,
                'is_featured' => true,
                'rating' => 4.5,
                'reviews_count' => 0,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $transformedProducts,
            ],
        ]);
    }
}
