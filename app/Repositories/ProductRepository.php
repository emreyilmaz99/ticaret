<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository extends EloquentBaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function findForVendor(int $vendorId, $productId): ?Product
    {
        return $this->model->where('id', $productId)->where('vendor_id', $vendorId)->first();
    }

    public function findById($id): ?Product
    {
        return $this->model->find($id);
    }

    public function listForVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        // eager-load category so API resources can include category data without N+1
        $products = $this->model->with(['photos','variants','tags','category'])
            ->where('vendor_id', $vendorId)
            ->orderByDesc('created_at')
            ->paginate($perPage);
        
        // Debug: Log first product photos
        if ($products->count() > 0) {
            $first = $products->first();
            \Log::info('Product Photos Debug', [
                'product_id' => $first->id,
                'product_name' => $first->name,
                'photos_count' => $first->photos->count(),
                'photos_data' => $first->photos->map(fn($p) => [
                    'id' => $p->id,
                    'path' => $p->path,
                    'url' => $p->url,
                    'file_path' => $p->file_path
                ])->toArray()
            ]);
        }
        
        return $products;
    }

    public function existsBySlug(string $slug): bool
    {
        return $this->model->where('slug', $slug)->exists();
    }

    public function create(array $data): Product
    {
        /** @var Product */
        return parent::create($data);
    }

    public function update($id, array $data): Product
    {
        /** @var Product */
        return parent::update($id, $data);
    }

    /**
     * Get active products for featured deals selection
     */
    public function getActiveProductsForSelection(): \Illuminate\Support\Collection
    {
        return $this->model->where('status', 'active')
            ->with(['variants', 'photos', 'vendor'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Get filtered products for admin management
     */
    public function getFilteredForAdmin(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['vendor', 'category', 'photos', 'variants', 'tags']);
        
        if (isset($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['vendor_id']) && $filters['vendor_id']) {
            $query->where('vendor_id', $filters['vendor_id']);
        }
        
        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }
        
        $sortField = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        return $query->paginate($perPage);
    }

    /**
     * Find product with admin details
     */
    public function findWithAdminDetails(int|string $id): ?Product
    {
        return $this->model->with(['vendor', 'category', 'photos', 'variants', 'tags'])->find($id);
    }

    /**
     * Update product status
     */
    public function updateStatus(int|string $id, array $data): ?Product
    {
        $product = $this->model->find($id);
        if (!$product) {
            return null;
        }
        
        $product->update($data);
        return $product->fresh(['vendor', 'category', 'photos', 'variants', 'tags']);
    }

    /**
     * Bulk update status for multiple products
     */
    public function bulkUpdateStatus(array $productIds, string $status): int
    {
        return $this->model->whereIn('id', $productIds)->update(['status' => $status]);
    }

    /**
     * Bulk update multiple products with data array (for admin with rejection info)
     */
    public function bulkUpdateWithData(array $productIds, array $data): int
    {
        return $this->model->whereIn('id', $productIds)->update($data);
    }

    /**
     * Get product statistics by status
     */
    public function getStatistics(): array
    {
        return [
            'total' => $this->model->count(),
            'pending' => $this->model->where('status', 'pending')->count(),
            'active' => $this->model->where('status', 'active')->count(),
            'rejected' => $this->model->where('status', 'rejected')->count(),
            'draft' => $this->model->where('status', 'draft')->count(),
            'inactive' => $this->model->where('status', 'inactive')->count(),
            'banned' => $this->model->where('status', 'banned')->count(),
        ];
    }

    /**
     * Find active product with featured deal for cart
     */
    public function findActiveWithDeal(string $productId): ?Product
    {
        return $this->model
            ->with('activeFeaturedDeal')
            ->where('id', $productId)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Find product with first variant
     */
    public function findWithFirstVariant(string $productId): ?Product
    {
        return $this->model
            ->with(['variants' => fn($q) => $q->limit(1)])
            ->find($productId);
    }

    /**
     * Get active public products with filters (for public catalog)
     */
    public function getActivePublicProducts(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = $this->model->with(['variants', 'photos', 'category', 'vendor:id,name,slug'])
            ->where('status', 'active')
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'));

        // Category filter
        if (!empty($filters['category_ids'])) {
            $query->whereIn('category_id', $filters['category_ids']);
        }

        // Price filters
        if (!empty($filters['min_price'])) {
            $query->whereHas('variants', fn($q) => $q->where('price', '>=', $filters['min_price']));
        }
        if (!empty($filters['max_price'])) {
            $query->whereHas('variants', fn($q) => $q->where('price', '<=', $filters['max_price']));
        }

        // Featured filter
        if (!empty($filters['is_featured'])) {
            $query->where('is_featured', true);
        }

        // Search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $allowedSorts = ['created_at', 'name', 'views'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        return $query->paginate($perPage);
    }

    /**
     * Get featured products
     */
    public function getFeaturedProducts(int $limit = 8)
    {
        return $this->model->with(['variants', 'photos', 'vendor:id,name,slug'])
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
    public function getRelatedProducts(string $productId, ?int $categoryId, int $limit = 4)
    {
        return $this->model->with(['variants', 'photos', 'vendor:id,name,slug'])
            ->where('status', 'active')
            ->where('id', '!=', $productId)
            ->where('category_id', $categoryId)
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get product by slug for public view
     */
    public function findActiveBySlug(string $slug): ?Product
    {
        return $this->model->with([
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
     * Increment product view count
     */
    public function incrementViews(string $productId): void
    {
        $this->model->where('id', $productId)->increment('views');
    }

    /**
     * Sync tags for a product
     */
    public function syncTags(string $productId, array $tagIds): void
    {
        $product = $this->findById($productId);
        if ($product) {
            $product->tags()->sync($tagIds);
        }
    }

    /**
     * Get fresh product with relations
     */
    public function freshWithRelations(string $productId, array $relations = ['variants', 'tags', 'photos']): ?Product
    {
        return $this->model->with($relations)->find($productId);
    }

    /**
     * Get products with relations and active vendor filter
     */
    public function getActiveProductsQuery()
    {
        return $this->model
            ->where('status', 'active')
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'));
    }

    /**
     * Get products with full relations for public listing
     */
    public function getPublicProductsWithFilters(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = $this->model->with(['variants', 'photos', 'category', 'vendor:id,name,slug', 'activeFeaturedDeal'])
            ->where('status', 'active')
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'));

        // Category filter
        if (!empty($filters['category_ids'])) {
            $query->whereIn('category_id', $filters['category_ids']);
        }

        // Price filters
        if (!empty($filters['min_price'])) {
            $query->whereHas('variants', fn($q) => $q->where('price', '>=', $filters['min_price']));
        }
        if (!empty($filters['max_price'])) {
            $query->whereHas('variants', fn($q) => $q->where('price', '<=', $filters['max_price']));
        }

        // Featured filter
        if (!empty($filters['is_featured'])) {
            $query->where('is_featured', true);
        }

        // Search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $allowedSorts = ['created_at', 'name', 'views', 'price'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        return $query->paginate($perPage);
    }

    /**
     * Get product by slug for detail page
     */
    public function getProductDetailBySlug(string $slug): ?Product
    {
        return $this->model->with([
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
    }

    /**
     * Get related products by category or vendor
     */
    public function getRelatedProductsExtended(string $productId, ?int $categoryId, ?int $vendorId, int $limit = 4)
    {
        return $this->model->with(['variants', 'photos', 'category', 'activeFeaturedDeal'])
            ->where('status', 'active')
            ->where('id', '!=', $productId)
            ->where(function($q) use ($categoryId, $vendorId) {
                $q->where('category_id', $categoryId)
                  ->orWhere('vendor_id', $vendorId);
            })
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    /**
     * Get featured products with deal info
     */
    public function getFeaturedProductsWithDeals(int $limit = 8)
    {
        return $this->model->with(['variants', 'photos', 'category', 'activeFeaturedDeal'])
            ->where('status', 'active')
            ->where('is_featured', true)
            ->whereHas('vendor', fn($q) => $q->where('status', 'active'))
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Find active product by slug (simple)
     */
    public function findActiveBySlugSimple(string $slug): ?Product
    {
        return $this->model
            ->where('slug', $slug)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Count active products by vendor
     */
    public function countActiveByVendor(int $vendorId): int
    {
        return $this->model
            ->where('vendor_id', $vendorId)
            ->where('status', 'active')
            ->count();
    }
}
