<?php

namespace App\Services\Product;

use App\Services\BaseService;
use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Http\Request;

/**
 * ProductCatalogService
 * 
 * Handles product listing, search, filtering and public queries.
 * Optimized for read-heavy operations.
 */
class ProductCatalogService extends BaseService
{
    protected ProductRepositoryInterface $repo;

    public function __construct(ProductRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Get products with filters (public)
     */
    public function getPublicProducts(Request $request)
    {
        $query = Product::with(['variants', 'photos', 'category', 'vendor:id,name,slug'])
            ->where('status', 'active')
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'));

        // Category filter
        if ($request->filled('category_id')) {
            $categoryId = $request->category_id;
            $categoryIds = \App\Models\Category::where('id', $categoryId)
                ->orWhere('parent_id', $categoryId)
                ->pluck('id');
            $query->whereIn('category_id', $categoryIds);
        }

        if ($request->filled('category_slug')) {
            $category = \App\Models\Category::where('slug', $request->category_slug)->first();
            if ($category) {
                $categoryIds = \App\Models\Category::where('id', $category->id)
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
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSorts = ['created_at', 'name', 'views'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $perPage = min((int) $request->get('per_page', 12), 100);
        return $query->paginate($perPage);
    }

    /**
     * Get featured products
     */
    public function getFeaturedProducts(int $limit = 8)
    {
        return Product::with(['variants', 'photos', 'vendor:id,name,slug'])
            ->where('status', 'active')
            ->where('is_featured', true)
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get related products
     */
    public function getRelatedProducts(Product $product, int $limit = 4)
    {
        return Product::with(['variants', 'photos', 'vendor:id,name,slug'])
            ->where('status', 'active')
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get product by slug (public)
     */
    public function getBySlug(string $slug)
    {
        return Product::with([
            'variants', 
            'photos', 
            'category', 
            'vendor.addresses' => fn($q) => $q->where('is_primary', true),
            'tags'
        ])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->first();
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $productId): void
    {
        Product::where('id', $productId)->increment('views');
    }
}
