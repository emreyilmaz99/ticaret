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
        $product = Product::with([
            'variants.unit', 
            'variants.variantMetadata',
            'photos', 
            'category.parent', 
            'vendor:id,name,slug,company_name,phone,rating_avg,rating_count,created_at',
            'vendor.media',
            'vendor.metadata',
            'tags',
            'productMetadata',
            'settings'
        ])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->firstOrFail();

        $minPrice = $product->variants->min('price');
        $maxPrice = $product->variants->max('price');
        $totalStock = $product->variants->sum('stock');

        // Build breadcrumb
        $breadcrumb = [];
        if ($product->category) {
            if ($product->category->parent) {
                $breadcrumb[] = [
                    'name' => $product->category->parent->name,
                    'slug' => $product->category->parent->slug,
                ];
            }
            $breadcrumb[] = [
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ];
        }

        // Parse metadata into key-value pairs for specs
        $specifications = [];
        foreach ($product->productMetadata as $meta) {
            $specifications[$meta->meta_key] = $meta->meta_value;
        }

        // Parse product settings
        $productSettings = [];
        foreach ($product->settings as $setting) {
            $productSettings[$setting->setting_key] = $setting->setting_value;
        }

        // Get vendor info
        $vendorLogo = null;
        $vendorBanner = null;
        $vendorProductCount = 0;
        $vendorDescription = null;
        
        if ($product->vendor) {
            // Get vendor media
            if ($product->vendor->media) {
                $logoMedia = $product->vendor->media->where('type', 'logo')->first();
                $vendorLogo = $logoMedia ? ($logoMedia->url ?: asset('storage/' . $logoMedia->path)) : null;
                
                $bannerMedia = $product->vendor->media->where('type', 'banner')->first();
                $vendorBanner = $bannerMedia ? ($bannerMedia->url ?: asset('storage/' . $bannerMedia->path)) : null;
            }
            
            // Get vendor product count
            $vendorProductCount = Product::where('vendor_id', $product->vendor->id)
                ->where('status', 'active')
                ->count();
            
            // Get vendor description from metadata
            if ($product->vendor->metadata) {
                $descMeta = $product->vendor->metadata->where('meta_key', 'description')->first();
                $vendorDescription = $descMeta ? $descMeta->meta_value : null;
            }
        }

        // Calculate low stock warning
        $lowStockThreshold = 5;
        $showLowStockWarning = $totalStock > 0 && $totalStock <= $lowStockThreshold;

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
                    'type' => $product->type, // simple or variable
                    'breadcrumb' => $breadcrumb,
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
                        'name' => $product->vendor->company_name ?: $product->vendor->name,
                        'slug' => $product->vendor->slug,
                        'phone' => $product->vendor->phone,
                        'rating' => (float) $product->vendor->rating_avg,
                        'rating_count' => $product->vendor->rating_count,
                        'logo' => $vendorLogo,
                        'banner' => $vendorBanner,
                        'product_count' => $vendorProductCount,
                        'description' => $vendorDescription,
                        'member_since' => $product->vendor->created_at?->format('Y'),
                    ] : null,
                    'price' => $minPrice,
                    'price_range' => $minPrice !== $maxPrice ? [
                        'min' => $minPrice,
                        'max' => $maxPrice,
                    ] : null,
                    'stock' => $totalStock,
                    'in_stock' => $totalStock > 0,
                    'low_stock_warning' => $showLowStockWarning,
                    'variants' => $product->variants->map(fn($v) => [
                        'id' => $v->id,
                        'sku' => $v->sku,
                        'title' => $v->title,
                        'price' => $v->price,
                        'stock' => $v->stock,
                        'in_stock' => $v->stock > 0,
                        'low_stock' => $v->stock > 0 && $v->stock <= $lowStockThreshold,
                        'unit' => $v->unit ? $v->unit->symbol : null,
                        'unit_name' => $v->unit ? $v->unit->name : null,
                        'weight' => $v->weight,
                        'dimensions' => $v->length || $v->width || $v->height ? [
                            'length' => $v->length,
                            'width' => $v->width,
                            'height' => $v->height,
                        ] : null,
                        'attributes' => $v->variantMetadata->pluck('meta_value', 'meta_key')->toArray(),
                    ]),
                    'images' => $product->photos->sortBy('sort_order')->map(fn($p) => [
                        'id' => $p->id,
                        'url' => $p->url ?: asset('storage/' . $p->path),
                        'alt' => $p->alt,
                    ])->values(),
                    'tags' => $product->tags->map(fn($t) => [
                        'id' => $t->id,
                        'name' => $t->name,
                        'slug' => $t->slug,
                    ]),
                    'specifications' => $specifications,
                    'settings' => $productSettings,
                    'is_featured' => $product->is_featured,
                    'rating' => 4.5, // TODO: Implement product ratings
                    'reviews_count' => 0, // TODO: Implement product reviews
                    'created_at' => $product->created_at,
                ],
            ],
        ]);
    }

    /**
     * Get related products
     */
    public function related(string $slug, Request $request): JsonResponse
    {
        $product = Product::where('slug', $slug)->where('status', 'active')->firstOrFail();
        
        $limit = min($request->get('limit', 4), 12);

        $relatedProducts = Product::with(['variants', 'photos', 'category'])
            ->where('status', 'active')
            ->where('id', '!=', $product->id)
            ->where(function($q) use ($product) {
                // Same category or same vendor
                $q->where('category_id', $product->category_id)
                  ->orWhere('vendor_id', $product->vendor_id);
            })
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->inRandomOrder()
            ->limit($limit)
            ->get();

        $transformed = $relatedProducts->map(function ($p) {
            $minPrice = $p->variants->min('price');
            $mainPhoto = $p->photos->sortBy('sort_order')->first();

            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'category' => $p->category?->name,
                'price' => $minPrice,
                'image' => $mainPhoto ? ($mainPhoto->url ?: asset('storage/' . $mainPhoto->path)) : null,
                'rating' => 4.5,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $transformed,
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
