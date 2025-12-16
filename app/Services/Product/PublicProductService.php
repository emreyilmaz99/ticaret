<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
use App\Models\Category;
use App\Models\Product;
use App\Services\BaseService;
use App\Traits\FormatsProductData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PublicProductService extends BaseService
{
    use FormatsProductData;
    
    protected const LOW_STOCK_THRESHOLD = 5;
    protected const DEFAULT_PER_PAGE = 12;
    protected const MAX_PER_PAGE = 50;
    protected const FEATURED_CACHE_TTL = 900; // 15 minutes
    protected const CATEGORIES_CACHE_TTL = 3600; // 1 hour
    /**
     * Get public product listing with filters
     */
    public function getProducts(Request $request): ServiceResponse
    {
        try {
            $query = Product::with(['variants', 'photos', 'category', 'vendor:id,name,slug', 'activeFeaturedDeal'])
                ->where('status', 'active')
                ->whereHas('vendor', fn($q) => $q->where('status', 'active'));

            // Apply filters
            $this->applyCategoryFilter($query, $request);
            $this->applyPriceFilter($query, $request);
            $this->applySearchFilter($query, $request);

            // Featured filter
            if ($request->boolean('is_featured')) {
                $query->where('is_featured', true);
            }

            // Apply sorting
            $this->applySorting($query, $request);

            $perPage = min($request->get('per_page', self::DEFAULT_PER_PAGE), self::MAX_PER_PAGE);
            $products = $query->paginate($perPage);

            $transformedProducts = $products->getCollection()->map(function ($product) {
                return $this->transformProductForList($product);
            });

            return $this->successResponse([
                'data' => $transformedProducts,
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürünler alınamadı');
        }
    }

    /**
     * Get single product details by slug
     */
    public function getProductBySlug(string $slug): ServiceResponse
    {
        try {
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
                'settings',
                'activeFeaturedDeal'
            ])
                ->where('slug', $slug)
                ->where('status', 'active')
                ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
                ->first();

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            return $this->successResponse([
                'product' => $this->transformProductForDetail($product),
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürün detayları alınamadı');
        }
    }

    /**
     * Get related products
     */
    public function getRelatedProducts(string $slug, int $limit = 4): ServiceResponse
    {
        try {
            $product = Product::where('slug', $slug)->where('status', 'active')->first();

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }
            
            $limit = min($limit, 12);

            $relatedProducts = Product::with(['variants', 'photos', 'category', 'activeFeaturedDeal'])
                ->where('status', 'active')
                ->where('id', '!=', $product->id)
                ->where(function($q) use ($product) {
                    $q->where('category_id', $product->category_id)
                      ->orWhere('vendor_id', $product->vendor_id);
                })
                ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
                ->inRandomOrder()
                ->limit($limit)
                ->get();

            $transformed = $relatedProducts->map(fn($p) => $this->transformProductForCard($p));

            return $this->successResponse([
                'products' => $transformed,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'İlgili ürünler alınamadı');
        }
    }

    /**
     * Get featured products (cached)
     */
    public function getFeaturedProducts(int $limit = 8): ServiceResponse
    {
        try {
            $limit = min($limit, 20);
            $cacheKey = "featured_products:{$limit}";

            $transformedProducts = Cache::remember($cacheKey, self::FEATURED_CACHE_TTL, function () use ($limit) {
                $products = Product::with(['variants', 'photos', 'category', 'activeFeaturedDeal'])
                    ->where('status', 'active')
                    ->where('is_featured', true)
                    ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
                    ->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->get();

                return $products->map(function ($product) {
                    $cardData = $this->transformProductForCard($product);
                    $cardData['is_featured'] = true;
                    return $cardData;
                });
            });

            return $this->successResponse([
                'products' => $transformedProducts,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Öne çıkan ürünler alınamadı');
        }
    }

    /**
     * Transform product for listing
     */
    protected function transformProductForList(Product $product): array
    {
        $minPrice = $product->variants->min('price');
        $maxPrice = $product->variants->max('price');
        $totalStock = $product->variants->sum('stock');
        $mainPhoto = $product->photos->sortBy('sort_order')->first();
        
        // Get active featured deal (eager loaded - no extra query!)
        $featuredDeal = $product->activeFeaturedDeal;
        
        // Use deal price if available, otherwise regular price
        $displayPrice = $featuredDeal ? $featuredDeal->deal_price : $minPrice;
        $originalPrice = $featuredDeal ? $featuredDeal->original_price : null;

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
            'price' => $displayPrice, // Indirimli fiyat varsa onu göster
            'original_price' => $originalPrice, // Üstü çizilecek fiyat
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
            'stock' => $totalStock,
            'in_stock' => $totalStock > 0,
            'image' => $this->formatImageUrl($mainPhoto),
            'images' => $product->photos->sortBy('sort_order')->map(fn($p) => $this->formatImageUrl($p))->filter()->values(),
            'is_featured' => $product->is_featured,
            'variants_count' => $product->variants->count(),
            'rating_avg' => $product->average_rating ?? 0,
            'review_count' => $product->review_count ?? 0,
            'created_at' => $product->created_at,
        ];
    }

    /**
     * Transform product for detail view
     */
    protected function transformProductForDetail(Product $product): array
    {
        $minPrice = $product->variants->min('price');
        $maxPrice = $product->variants->max('price');
        $totalStock = $product->variants->sum('stock');
        $showLowStockWarning = $totalStock > 0 && $totalStock <= self::LOW_STOCK_THRESHOLD;

        // Get active featured deal (eager loaded)
        $featuredDeal = $product->activeFeaturedDeal;
        $displayPrice = $featuredDeal ? $featuredDeal->deal_price : $minPrice;
        $originalPrice = $featuredDeal ? $featuredDeal->original_price : null;

        // Use helper methods
        $breadcrumb = $this->buildBreadcrumb($product->category);
        $specifications = $this->parseMetadataToArray($product->productMetadata);
        $productSettings = $this->parseSettingsToArray($product->settings);
        $vendorData = $this->buildVendorData($product);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'short_description' => $product->short_description,
            'description' => $product->description,
            'type' => $product->type,
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
            'vendor' => $vendorData,
            'price' => $displayPrice,
            'original_price' => $originalPrice,
            'discount_percentage' => $featuredDeal?->discount_percentage,
            'has_deal' => $featuredDeal !== null,
            'deal_badge' => $featuredDeal ? [
                'text' => $featuredDeal->badge_text,
                'color' => $featuredDeal->badge_color,
            ] : null,
            'deal_ends_at' => $featuredDeal?->ends_at,
            'price_range' => $minPrice !== $maxPrice ? [
                'min' => $minPrice,
                'max' => $maxPrice,
            ] : null,
            'stock' => $totalStock,
            'in_stock' => $totalStock > 0,
            'low_stock_warning' => $showLowStockWarning,
            'variants' => $product->variants->map(fn($v) => $this->transformVariant($v)),
            'images' => $product->photos->sortBy('sort_order')->map(fn($p) => [
                'id' => $p->id,
                'url' => $this->formatImageUrl($p),
                'alt' => $p->alt,
            ])->filter(fn($img) => $img['url'] !== null)->values(),
            'tags' => $product->tags->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
            ]),
            'specifications' => $specifications,
            'settings' => $productSettings,
            'is_featured' => $product->is_featured,
            'rating_avg' => $product->average_rating ?? 0,
            'review_count' => $product->review_count ?? 0,
            'created_at' => $product->created_at,
        ];
    }

    /**
     * Build vendor data for product detail
     */
    protected function buildVendorData(Product $product): ?array
    {
        if (!$product->vendor) {
            return null;
        }

        $vendor = $product->vendor;
        $vendorLogo = null;
        $vendorBanner = null;
        $vendorDescription = null;
        
        // Get vendor media
        if ($vendor->media) {
            $logoMedia = $vendor->media->where('type', 'logo')->first();
            $vendorLogo = $this->formatImageUrl($logoMedia);
            
            $bannerMedia = $vendor->media->where('type', 'banner')->first();
            $vendorBanner = $this->formatImageUrl($bannerMedia);
        }
        
        // Get vendor product count
        $vendorProductCount = Product::where('vendor_id', $vendor->id)
            ->where('status', 'active')
            ->count();
        
        // Get vendor description from metadata
        if ($vendor->metadata) {
            $metadataArray = $this->parseMetadataToArray($vendor->metadata);
            $vendorDescription = $metadataArray['description'] ?? null;
        }

        return [
            'id' => $vendor->id,
            'name' => $vendor->company_name ?: $vendor->name,
            'slug' => $vendor->slug,
            'phone' => $vendor->phone,
            'rating' => (float) $vendor->rating_avg,
            'rating_count' => $vendor->rating_count,
            'logo' => $vendorLogo,
            'banner' => $vendorBanner,
            'product_count' => $vendorProductCount,
            'description' => $vendorDescription,
            'member_since' => $vendor->created_at?->format('Y'),
        ];
    }

    /**
     * Transform variant for response
     */
    protected function transformVariant($variant): array
    {
        return [
            'id' => $variant->id,
            'sku' => $variant->sku,
            'title' => $variant->title,
            'price' => $variant->price,
            'stock' => $variant->stock,
            'in_stock' => $variant->stock > 0,
            'low_stock' => $variant->stock > 0 && $variant->stock <= self::LOW_STOCK_THRESHOLD,
            'unit' => $variant->unit ? $variant->unit->symbol : null,
            'unit_name' => $variant->unit ? $variant->unit->name : null,
            'weight' => $variant->weight,
            'dimensions' => $variant->length || $variant->width || $variant->height ? [
                'length' => $variant->length,
                'width' => $variant->width,
                'height' => $variant->height,
            ] : null,
            'attributes' => $variant->variantMetadata->pluck('meta_value', 'meta_key')->toArray(),
        ];
    }

    // ==================== Helper Methods ====================

    /**
     * Apply category filter to query
     * Accepts both category ID (integer) and slug (string)
     */
    protected function applyCategoryFilter($query, Request $request): void
    {
        if ($request->filled('category_id')) {
            $categoryValue = $request->category_id;
            
            // Check if it's a numeric ID or a slug
            if (is_numeric($categoryValue)) {
                // Numeric ID
                $categoryIds = Category::where('id', $categoryValue)
                    ->orWhere('parent_id', $categoryValue)
                    ->pluck('id');
                $query->whereIn('category_id', $categoryIds);
            } else {
                // Slug string (like 'elektronik', 'moda')
                $category = Category::where('slug', $categoryValue)->first();
                if ($category) {
                    $categoryIds = Category::where('id', $category->id)
                        ->orWhere('parent_id', $category->id)
                        ->pluck('id');
                    $query->whereIn('category_id', $categoryIds);
                }
            }
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
    }

    /**
     * Apply price filter to query
     */
    protected function applyPriceFilter($query, Request $request): void
    {
        if ($request->filled('min_price')) {
            $query->whereHas('variants', fn($q) => $q->where('price', '>=', $request->min_price));
        }
        if ($request->filled('max_price')) {
            $query->whereHas('variants', fn($q) => $q->where('price', '<=', $request->max_price));
        }
    }

    /**
     * Apply search filter to query
     */
    protected function applySearchFilter($query, Request $request): void
    {
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Apply sorting to query
     */
    protected function applySorting($query, Request $request): void
    {
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
    }

    /**
     * Transform product for card view (list/featured/related)
     */
    protected function transformProductForCard(Product $product): array
    {
        $mainPhoto = $product->photos->sortBy('sort_order')->first();
        $featuredDeal = $product->activeFeaturedDeal;
        $minPrice = $product->variants->min('price');
        $displayPrice = $featuredDeal ? $featuredDeal->deal_price : $minPrice;
        $originalPrice = $featuredDeal ? $featuredDeal->original_price : null;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'category' => $product->category?->name,
            'price' => $displayPrice,
            'original_price' => $originalPrice,
            'has_deal' => $featuredDeal !== null,
            'discount_percentage' => $featuredDeal?->discount_percentage,
            'deal_badge' => $featuredDeal ? [
                'text' => $featuredDeal->badge_text,
                'color' => $featuredDeal->badge_color,
            ] : null,
            'image' => $this->formatImageUrl($mainPhoto),
            'rating_avg' => $product->average_rating ?? 0,
            'review_count' => $product->review_count ?? 0,
        ];
    }

    /**
     * Build breadcrumb for product
     */
    protected function buildBreadcrumb($category): array
    {
        $breadcrumb = [];
        
        if ($category) {
            if ($category->parent) {
                $breadcrumb[] = [
                    'name' => $category->parent->name,
                    'slug' => $category->parent->slug,
                ];
            }
            $breadcrumb[] = [
                'name' => $category->name,
                'slug' => $category->slug,
            ];
        }
        
        return $breadcrumb;
    }

    /**
     * Parse metadata collection to key-value array
     */
    protected function parseMetadataToArray($metadata): array
    {
        $result = [];
        foreach ($metadata as $meta) {
            $result[$meta->meta_key] = $meta->meta_value;
        }
        return $result;
    }

    /**
     * Parse settings collection to key-value array
     */
    protected function parseSettingsToArray($settings): array
    {
        $result = [];
        foreach ($settings as $setting) {
            $result[$setting->setting_key] = $setting->setting_value;
        }
        return $result;
    }

    /**
     * Get main categories (parent_id = null) with product counts (cached)
     * Only counts active products from active vendors
     */
    public function getMainCategories(): ServiceResponse
    {
        try {
            $categories = Cache::remember('main_categories_with_active_counts', self::CATEGORIES_CACHE_TTL, function () {
                return Category::whereNull('parent_id')
                    ->where('is_active', true)
                    ->with(['children' => fn($q) => $q->withCount('activeDirectProducts')])
                    ->withCount('activeDirectProducts')
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->map(function ($category) {
                        $directCount = $category->active_direct_products_count ?? 0;
                        $childrenCount = $category->children->sum('active_direct_products_count') ?? 0;
                        
                        return [
                            'id' => $category->id,
                            'name' => $category->name,
                            'slug' => $category->slug,
                            'count' => $directCount + $childrenCount,
                        ];
                    });
            });

            return $this->successResponse(['categories' => $categories]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ana kategoriler alınamadı');
        }
    }
}
