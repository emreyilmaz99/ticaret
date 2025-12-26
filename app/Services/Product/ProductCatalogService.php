<?php

namespace App\Services\Product;

use App\Interfaces\Services\Product\ProductCatalogServiceInterface;
use App\Services\BaseService;
use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Http\Request;

/**
 * ProductCatalogService
 * 
 * Handles product listing, search, filtering and public queries.
 * Optimized for read-heavy operations.
 */
class ProductCatalogService extends BaseService implements ProductCatalogServiceInterface
{
    public function __construct(
        protected ProductRepositoryInterface $repo,
        protected CategoryRepositoryInterface $categoryRepo
    ) {}

    /**
     * Get products with filters (public)
     */
    public function getPublicProducts(Request $request)
    {
        $filters = [];

        // Category filter - get category IDs including children
        if ($request->filled('category_id')) {
            $filters['category_ids'] = $this->getCategoryWithChildrenIds($request->category_id);
        }

        if ($request->filled('category_slug')) {
            $category = $this->categoryRepo->findActiveBySlug($request->category_slug);
            if ($category) {
                $filters['category_ids'] = $this->getCategoryWithChildrenIds($category->id);
            }
        }

        // Other filters
        if ($request->filled('min_price')) {
            $filters['min_price'] = $request->min_price;
        }
        if ($request->filled('max_price')) {
            $filters['max_price'] = $request->max_price;
        }
        if ($request->boolean('is_featured')) {
            $filters['is_featured'] = true;
        }
        if ($request->filled('search')) {
            $filters['search'] = $request->search;
        }

        $filters['sort_by'] = $request->get('sort_by', 'created_at');
        $filters['sort_order'] = $request->get('sort_order', 'desc');

        $perPage = min((int) $request->get('per_page', 12), 100);

        return $this->repo->getActivePublicProducts($filters, $perPage);
    }

    /**
     * Get featured products
     */
    public function getFeaturedProducts(int $limit = 8)
    {
        return $this->repo->getFeaturedProducts($limit);
    }

    /**
     * Get related products
     */
    public function getRelatedProducts(Product $product, int $limit = 4)
    {
        return $this->repo->getRelatedProducts($product->id, $product->category_id, $limit);
    }

    /**
     * Get product by slug (public)
     */
    public function getBySlug(string $slug)
    {
        return $this->repo->findActiveBySlug($slug);
    }

    /**
     * Increment view count
     */
    public function incrementViews(string $productId): void
    {
        $this->repo->incrementViews($productId);
    }

    /**
     * Get category ID with its children IDs
     */
    protected function getCategoryWithChildrenIds(int $categoryId): array
    {
        $category = $this->categoryRepo->findById($categoryId);
        if (!$category) {
            return [$categoryId];
        }

        $ids = [$categoryId];
        
        // Get direct children IDs
        if ($category->children) {
            foreach ($category->children as $child) {
                $ids[] = $child->id;
            }
        }

        return $ids;
    }
}
