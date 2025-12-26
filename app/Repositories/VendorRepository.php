<?php

namespace App\Repositories;

use App\Models\ProductReview;
use App\Models\Vendor;
use App\Repositories\Interfaces\VendorRepositoryInterface;
use Illuminate\Support\Facades\DB;

class VendorRepository extends EloquentBaseRepository implements VendorRepositoryInterface
{
    public function __construct(Vendor $model)
    {
        parent::__construct($model);
    }

    public function create(array $data): Vendor
    {
        return $this->model->create($data);
    }

    public function update($id, array $data): Vendor
    {
        $record = $this->model->findOrFail($id);
        $record->update($data);
        return $record;
    }

    // ==================== Finder Methods ====================

    /**
     * Find vendor by ID
     */
    public function findById($id): ?Vendor
    {
        return $this->model->find($id);
    }

    /**
     * Find vendor by slug
     */
    public function findBySlug(string $slug): ?Vendor
    {
        return $this->model->where('slug', $slug)->first();
    }

    /**
     * Find active vendor by slug (for public API)
     */
    public function findActiveBySlug(string $slug): ?Vendor
    {
        return $this->model
            ->where('slug', $slug)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Find vendor by email with roles
     */
    public function findByEmail(string $email): ?Vendor
    {
        return $this->model->with('roles')->where('email', $email)->first();
    }

    /**
     * Find with stats
     */
    public function findWithStats(int $id): ?Vendor
    {
        return $this->model
            ->withCount('products')
            ->withAvg('productReviews', 'rating')
            ->withCount('productReviews')
            ->find($id);
    }

    // ==================== Admin Methods ====================

    /**
     * List vendors for admin panel with stats and relations
     */
    public function listForAdmin(int $perPage = 15, ?string $status = null)
    {
        $query = $this->model
            ->with(['addresses' => function($q) {
                $q->where('is_primary', true);
            }, 'bankAccounts' => function($q) {
                $q->where('is_primary', true);
            }, 'commissionPlan'])
            ->withSum('payouts', 'amount')
            ->withCount('products')
            ->withAvg('productReviews', 'rating')
            ->withCount('productReviews')
            ->latest();

        if ($status) {
            $query->where('status', $status);
        } else {
            $query->whereNotNull('application_id')
                  ->where('status', 'active');
        }

        return $query->paginate($perPage);
    }

    /**
     * Get vendor statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->where('status', 'active')->count(),
            'pending' => $this->model->where('status', 'pending_full_approval')->count(),
            'suspended' => $this->model->where('status', 'suspended')->count(),
        ];
    }

    // ==================== Public Methods ====================

    /**
     * Get active product count for vendor
     */
    public function getActiveProductCount(int $vendorId): int
    {
        return DB::table('products')
            ->where('vendor_id', $vendorId)
            ->where('status', 'active')
            ->whereNull('deleted_at')
            ->count();
    }

    /**
     * Get vendor products with filters
     */
    public function getVendorProducts(int $vendorId, array $filters, int $perPage = 20)
    {
        $query = DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
            ->where('p.vendor_id', $vendorId)
            ->where('p.status', 'active')
            ->whereNull('p.deleted_at')
            ->select([
                'p.id', 'p.name', 'p.slug', 'p.short_description',
                'p.type', 'p.is_featured', 'p.created_at',
                'c.name as category_name', 'c.slug as category_slug'
            ]);

        // Category filter
        if (!empty($filters['category_id'])) {
            $query->where('p.category_id', $filters['category_id']);
        }

        // Search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('p.name', 'like', "%{$search}%")
                  ->orWhere('p.description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $filters['sort'] ?? $filters['sort_by'] ?? 'newest';
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('p.price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('p.price', 'desc');
                break;
            case 'rating':
                $query->orderBy('p.rating_avg', 'desc');
                break;
            case 'best_seller':
                $query->orderBy('p.total_sold', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('p.created_at', 'desc');
                break;
        }

        // Return paginated products (need to convert to Eloquent for proper Resource handling)
        $productIds = $query->paginate($perPage);
        
        // Load full Eloquent models for resources
        if ($productIds->count() > 0) {
            $ids = collect($productIds->items())->pluck('id');
            $products = \App\Models\Product::with(['photos', 'category', 'vendor', 'variants', 'activeFeaturedDeal'])
                ->whereIn('id', $ids)
                ->get()
                ->keyBy('id');
            
            // Replace items with full models maintaining order
            $productIds->setCollection(
                collect($productIds->items())->map(fn($item) => $products[$item->id])
            );
        }

        return $productIds;
    }

    /**
     * Get vendor categories with product counts
     */
    public function getVendorCategoriesWithCount(int $vendorId): array
    {
        $categories = DB::table('products as p')
            ->join('categories as c', 'p.category_id', '=', 'c.id')
            ->where('p.vendor_id', $vendorId)
            ->where('p.status', 'active')
            ->whereNull('p.deleted_at')
            ->groupBy('c.id', 'c.name', 'c.slug')
            ->select([
                'c.id',
                'c.name',
                'c.slug',
                DB::raw('COUNT(p.id) as product_count')
            ])
            ->orderBy('product_count', 'desc')
            ->get()
            ->toArray();

        return $categories;
    }

    /**
     * Get vendor reviews with filters
     */
    public function getVendorReviews(int $vendorId, array $filters, int $perPage = 10)
    {
        $productIds = DB::table('products')
            ->where('vendor_id', $vendorId)
            ->pluck('id');

        $query = ProductReview::with(['user', 'product'])
            ->whereIn('product_id', $productIds)
            ->where('status', 'approved');

        // Rating filter
        if (!empty($filters['rating'])) {
            $query->where('rating', $filters['rating']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'newest';
        switch ($sortBy) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'highest':
                $query->orderBy('rating', 'desc');
                break;
            case 'lowest':
                $query->orderBy('rating', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return $query->paginate($perPage);
    }

    /**
     * Get review rating distribution for vendor
     */
    public function getReviewDistribution(int $vendorId): array
    {
        $productIds = DB::table('products')
            ->where('vendor_id', $vendorId)
            ->pluck('id');

        $ratingData = DB::table('product_reviews')
            ->whereIn('product_id', $productIds)
            ->where('status', 'approved')
            ->select('rating', DB::raw('COUNT(*) as count'))
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get()
            ->keyBy('rating');

        $distribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $distribution[$i] = $ratingData->get($i)?->count ?? 0;
        }

        return $distribution;
    }

    // ==================== Optimization Methods ====================

    /**
     * Paginate vendors using Query Builder to avoid Eloquent model hydration for large lists.
     * Returns a LengthAwarePaginator of stdClass rows (lighter weight than Eloquent models).
     *
     * @param int $perPage
     * @param array $filters
     * @param array $select
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginateOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at'])
    {
        $table = $this->model->getTable();

        $query = DB::table($table)->select($select);

        if (! empty($filters)) {
            foreach ($filters as $key => $value) {
                // support simple where = filters; users can extend for complex filters
                $query->where($key, $value);
            }
        }

        return $query->paginate($perPage);
    }
    /**
     * Get product IDs for vendor
     */
    public function getProductIds(int $vendorId): array
    {
        return $this->model->findOrFail($vendorId)
            ->products()
            ->pluck('id')
            ->toArray();
    }}
