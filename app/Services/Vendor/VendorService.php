<?php

namespace App\Services\Vendor;

use App\Services\BaseService;
use App\Repositories\VendorRepository;
use App\Services\Vendor\VendorAddressService;
use App\Services\Vendor\VendorBankAccountService;
use App\Models\Vendor;
use App\Models\Product;
use App\Models\ProductReview;
use App\Core\ServiceResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class VendorService extends BaseService
{
    protected VendorRepository $repo;
    protected VendorAddressService $addressService;
    protected VendorBankAccountService $bankAccountService;

    public function __construct(
        VendorRepository $repo,
        VendorAddressService $addressService,
        VendorBankAccountService $bankAccountService
    ) {
        $this->repo = $repo;
        $this->addressService = $addressService;
        $this->bankAccountService = $bankAccountService;
    }

    // ==================== CRUD Operations ====================

    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function listOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at'])
    {
        return $this->repo->paginateOptimized($perPage, $filters, $select);
    }

    public function listForAdminResponse(int $perPage = 15, ?string $status = null)
    {
        $query = Vendor::with(['addresses' => function($q) {
                $q->where('is_primary', true);
            }, 'bankAccounts' => function($q) {
                $q->where('is_primary', true);
            }, 'commissionPlan'])
            ->withSum('payouts', 'amount')
            ->latest();

        if ($status) {
            $query->where('status', $status);
        } else {
            $query->whereNotNull('application_id')
                  ->where('status', 'active');
        }

        $paginator = $query->paginate($perPage);

        $data = [
            'data' => \App\Http\Resources\Api\V1\Admin\VendorResource::collection($paginator),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)
           ->setStatusCode(200)
           ->setMessage('Satıcılar listelendi')
           ->setData($data);

        return $sr;
    }

    public function find(int $id)
    {
        return $this->repo->find($id);
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            // Dosya yüklemeleri
            if (!empty($data['logo_file']) && $data['logo_file'] instanceof UploadedFile) {
                $path = $data['logo_file']->store("vendors/{$id}", 'public');
                $data['logo_path'] = $path;
                unset($data['logo_file']);
            }

            if (!empty($data['cover_file']) && $data['cover_file'] instanceof UploadedFile) {
                $path = $data['cover_file']->store("vendors/{$id}", 'public');
                $data['cover_path'] = $path;
                unset($data['cover_file']);
            }

            // Temel bilgileri güncelle
            $vendor = $this->repo->update($id, $data);

            // Adresleri senkronize et
            if (isset($data['addresses']) && is_array($data['addresses'])) {
                $this->addressService->sync($id, $data['addresses']);
            }

            // Banka hesaplarını senkronize et
            if (isset($data['bank_accounts']) && is_array($data['bank_accounts'])) {
                $this->bankAccountService->sync($id, $data['bank_accounts']);
            }

            return $vendor;
        });
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    // ==================== Backward Compatibility (Deprecated) ====================
    // Bu metodlar eski kodlarla uyumluluk için tutuldu.
    // Yeni kodlarda ilgili service'leri doğrudan kullanın.

    /**
     * @deprecated Use VendorAddressService::add() instead
     */
    public function addAddress(int $vendorId, array $data)
    {
        return $this->addressService->add($vendorId, $data);
    }

    /**
     * @deprecated Use VendorAddressService::list() instead
     */
    public function listAddresses(int $vendorId)
    {
        return $this->addressService->list($vendorId);
    }

    /**
     * @deprecated Use VendorAddressService::update() instead
     */
    public function updateAddress(int $vendorId, int $addressId, array $data)
    {
        return $this->addressService->update($vendorId, $addressId, $data);
    }

    /**
     * @deprecated Use VendorAddressService::delete() instead
     */
    public function deleteAddress(int $vendorId, int $addressId)
    {
        return $this->addressService->delete($vendorId, $addressId);
    }

    /**
     * @deprecated Use VendorBankAccountService::add() instead
     */
    public function addBankAccount(int $vendorId, array $data)
    {
        return $this->bankAccountService->add($vendorId, $data);
    }

    /**
     * @deprecated Use VendorBankAccountService::list() instead
     */
    public function listBankAccounts(int $vendorId)
    {
        return $this->bankAccountService->list($vendorId);
    }

    /**
     * @deprecated Use VendorBankAccountService::update() instead
     */
    public function updateBankAccount(int $vendorId, int $accountId, array $data)
    {
        return $this->bankAccountService->update($vendorId, $accountId, $data);
    }

    /**
     * @deprecated Use VendorBankAccountService::delete() instead
     */
    public function deleteBankAccount(int $vendorId, int $accountId)
    {
        return $this->bankAccountService->delete($vendorId, $accountId);
    }

    // ==================== Public API Methods ====================

    /**
     * Get vendor profile with stats for public API
     */
    public function getPublicProfile(string $slug): ServiceResponse
    {
        try {
            $vendor = Vendor::where('slug', $slug)
                ->where('status', 'active')
                ->first();

            if (!$vendor) {
                return $this->errorResponse('Satıcı bulunamadı', 404);
            }

            // Calculate product count
            $productCount = Product::where('vendor_id', $vendor->id)
                ->where('status', 'active')
                ->count();

            // Calculate stats
            $stats = [
                'product_count' => $productCount,
                'member_since' => $vendor->created_at->year,
                'follower_count' => 0, // TODO: Implement followers if needed
            ];

            $data = [
                'vendor' => $vendor,
                'stats' => $stats,
            ];

            return $this->successResponse($data, 'Satıcı profili getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Satıcı profili alınamadı');
        }
    }

    /**
     * Get vendor products with filters for public API
     */
    public function getProducts(string $slug, array $filters = []): ServiceResponse
    {
        try {
            $vendor = Vendor::where('slug', $slug)
                ->where('status', 'active')
                ->first();

            if (!$vendor) {
                return $this->errorResponse('Satıcı bulunamadı', 404);
            }

            $query = Product::with(['photos', 'category', 'vendor', 'variants', 'activeFeaturedDeal'])
                ->where('vendor_id', $vendor->id)
                ->where('status', 'active');

            // Category filter
            if (!empty($filters['category_id'])) {
                $query->where('category_id', $filters['category_id']);
            }

            // Search filter
            if (!empty($filters['search'])) {
                $search = $filters['search'];
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Has discount filter
            if (!empty($filters['has_discount'])) {
                $query->whereHas('activeFeaturedDeal');
            }

            // Price range filters
            if (!empty($filters['min_price'])) {
                $query->whereHas('variants', function($q) use ($filters) {
                    $q->where('price', '>=', $filters['min_price']);
                });
            }
            if (!empty($filters['max_price'])) {
                $query->whereHas('variants', function($q) use ($filters) {
                    $q->where('price', '<=', $filters['max_price']);
                });
            }

            // Apply filters
            if (!empty($filters['filter'])) {
                switch ($filters['filter']) {
                    case 'high_rated':
                        $query->where('rating_avg', '>=', 4);
                        break;
                    case 'discounted':
                        $query->whereColumn('compare_at_price', '>', 'price');
                        break;
                }
            }

            // Sorting
            $sortBy = $filters['sort'] ?? $filters['sort_by'] ?? 'newest';
            switch ($sortBy) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'rating':
                    $query->orderBy('rating_avg', 'desc');
                    break;
                case 'best_seller':
                    $query->orderBy('total_sold', 'desc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            $perPage = $filters['per_page'] ?? 20;
            $products = $query->paginate($perPage);

            return $this->successResponse($products, 'Satıcı ürünleri getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Satıcı ürünleri alınamadı');
        }
    }

    /**
     * Get vendor categories with product counts
     */
    public function getCategories(string $slug): ServiceResponse
    {
        try {
            $vendor = Vendor::where('slug', $slug)
                ->where('status', 'active')
                ->first();

            if (!$vendor) {
                return $this->errorResponse('Satıcı bulunamadı', 404);
            }

            $categories = Product::where('vendor_id', $vendor->id)
                ->where('status', 'active')
                ->with('category')
                ->get()
                ->pluck('category')
                ->filter()
                ->unique('id')
                ->map(function($category) use ($vendor) {
                    $productCount = Product::where('vendor_id', $vendor->id)
                        ->where('category_id', $category->id)
                        ->where('status', 'active')
                        ->count();
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'product_count' => $productCount,
                    ];
                })
                ->values();

            return $this->successResponse($categories, 'Satıcı kategorileri getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Satıcı kategorileri alınamadı');
        }
    }

    /**
     * Get vendor reviews with filters
     */
    public function getReviews(string $slug, array $filters = []): ServiceResponse
    {
        try {
            $vendor = Vendor::where('slug', $slug)
                ->where('status', 'active')
                ->first();

            if (!$vendor) {
                return $this->errorResponse('Satıcı bulunamadı', 404);
            }

            // Get all product IDs for this vendor
            $productIds = Product::where('vendor_id', $vendor->id)->pluck('id');

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

            $perPage = $filters['per_page'] ?? 10;
            $reviews = $query->paginate($perPage);

            // Calculate rating distribution
            $ratingDistribution = ProductReview::whereIn('product_id', $productIds)
                ->where('status', 'approved')
                ->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->orderBy('rating', 'desc')
                ->get()
                ->keyBy('rating');

            $distribution = [];
            for ($i = 5; $i >= 1; $i--) {
                $distribution[$i] = $ratingDistribution->get($i)?->count ?? 0;
            }

            $data = [
                'reviews' => $reviews,
                'summary' => [
                    'average_rating' => round((float)($vendor->rating_avg ?? 0), 1),
                    'total_reviews' => $vendor->review_count ?? 0,
                    'distribution' => $distribution,
                ]
            ];

            return $this->successResponse($data, 'Satıcı yorumları getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Satıcı yorumları alınamadı');
        }
    }
}
