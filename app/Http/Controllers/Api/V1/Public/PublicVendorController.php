<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Traits\FormatsProductData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicVendorController extends Controller
{
    use FormatsProductData;
    /**
     * Get vendor profile by slug
     * GET /api/v1/vendors/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $vendor = Vendor::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        // Calculate stats
        $stats = [
            'total_products' => $vendor->products()->where('status', 'active')->count(),
            'total_reviews' => $vendor->products()
                ->withCount(['reviews' => function ($query) {
                    $query->where('status', 'approved');
                }])
                ->get()
                ->sum('reviews_count'),
            'average_rating' => round($vendor->products()
                ->with(['reviews' => function ($query) {
                    $query->where('status', 'approved');
                }])
                ->get()
                ->flatMap->reviews
                ->avg('rating') ?? 0, 1),
            'followers' => 0, // TODO: Implement followers if needed
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'vendor' => [
                    'id' => $vendor->id,
                    'business_name' => $vendor->business_name,
                    'slug' => $vendor->slug,
                    'description' => $vendor->description,
                    'logo' => $vendor->logo ? url('/storage/' . $vendor->logo) : null,
                    'banner' => $vendor->banner ? url('/storage/' . $vendor->banner) : null,
                    'city' => $vendor->city,
                    'district' => $vendor->district,
                    'created_at' => $vendor->created_at->format('Y-m-d'),
                ],
                'stats' => $stats,
            ],
        ]);
    }

    /**
     * Get vendor products
     * GET /api/v1/vendors/{slug}/products
     */
    public function products(Request $request, string $slug): JsonResponse
    {
        $vendor = Vendor::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $query = $vendor->products()
            ->with(['photos', 'variants', 'category', 'activeFeaturedDeal'])
            ->where('status', 'active');

        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Has discount filter (for deals tab)
        if ($request->boolean('has_discount')) {
            $query->whereHas('activeFeaturedDeal');
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->whereHas('variants', function($q) use ($request) {
                $q->where('price', '>=', $request->min_price);
            });
        }
        if ($request->filled('max_price')) {
            $query->whereHas('variants', function($q) use ($request) {
                $q->where('price', '<=', $request->max_price);
            });
        }

        // Sorting
        $sortBy = $request->get('sort', 'newest');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'popular':
                $query->orderByDesc('view_count');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(20);

        // Transform products using the same logic as PublicProductService
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
                'rating' => $product->rating_avg ?? 0,
                'reviews_count' => $product->reviews_count ?? 0,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedProducts,
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * Get vendor categories (categories that have products)
     * GET /api/v1/vendors/{slug}/categories
     */
    public function categories(string $slug): JsonResponse
    {
        $vendor = Vendor::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $categories = $vendor->products()
            ->where('status', 'active')
            ->with('category')
            ->get()
            ->pluck('category')
            ->filter()
            ->unique('id')
            ->values()
            ->map(function ($category) use ($vendor) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'product_count' => $vendor->products()
                        ->where('category_id', $category->id)
                        ->where('status', 'active')
                        ->count(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Get vendor reviews
     * GET /api/v1/vendors/{slug}/reviews
     */
    public function reviews(Request $request, string $slug): JsonResponse
    {
        $vendor = Vendor::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $query = \App\Models\ProductReview::whereIn(
            'product_id',
            $vendor->products()->where('status', 'active')->pluck('id')
        )
            ->where('status', 'approved')
            ->with(['user', 'product.photos', 'media']);

        // Rating filter
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        // Sorting
        $sortBy = $request->get('sort', 'newest');
        switch ($sortBy) {
            case 'oldest':
                $query->oldest();
                break;
            case 'highest':
                $query->orderBy('rating', 'desc');
                break;
            case 'lowest':
                $query->orderBy('rating', 'asc');
                break;
            case 'helpful':
                $query->orderBy('helpful_count', 'desc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        $reviews = $query->paginate(10);

        // Transform reviews
        $transformedReviews = $reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
                'is_anonymous' => $review->is_anonymous,
                'is_verified_purchase' => $review->is_verified_purchase,
                'helpful_count' => $review->helpful_count,
                'unhelpful_count' => $review->unhelpful_count,
                'created_at' => $review->created_at->format('Y-m-d'),
                'user' => $review->is_anonymous ? null : [
                    'name' => $review->user->name,
                    'avatar' => $review->user->avatar_url,
                ],
                'product' => [
                    'id' => $review->product->id,
                    'name' => $review->product->name,
                    'slug' => $review->product->slug,
                    'image' => $review->product->photos->first()?->path
                        ? url('/storage/' . $review->product->photos->first()->path)
                        : null,
                ],
                'media' => $review->media->map(function ($media) {
                    return [
                        'type' => $media->type,
                        'url' => url('/storage/' . $media->path),
                    ];
                }),
            ];
        });

        // Calculate review summary
        $allReviews = \App\Models\ProductReview::whereIn(
            'product_id',
            $vendor->products()->where('status', 'active')->pluck('id')
        )->where('status', 'approved')->get();

        $summary = [
            'average_rating' => round($allReviews->avg('rating') ?? 0, 1),
            'total_reviews' => $allReviews->count(),
            'rating_distribution' => [
                5 => $allReviews->where('rating', 5)->count(),
                4 => $allReviews->where('rating', 4)->count(),
                3 => $allReviews->where('rating', 3)->count(),
                2 => $allReviews->where('rating', 2)->count(),
                1 => $allReviews->where('rating', 1)->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $transformedReviews,
            'summary' => $summary,
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }
}
