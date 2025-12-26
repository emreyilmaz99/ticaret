<?php

namespace App\Services\Public;

use App\Core\ServiceResponse;
use App\Models\Vendor;
use App\Repositories\Interfaces\VendorRepositoryInterface;
use App\Services\BaseService;

class PublicVendorService extends BaseService
{
    public function __construct(
        protected VendorRepositoryInterface $repo
    ) {}

    /**
     * Get vendor profile with stats for public API
     */
    public function getProfile(string $slug): ServiceResponse
    {
        try {
            $vendor = $this->repo->findActiveBySlug($slug);

            if (!$vendor) {
                return $this->errorResponse('Satıcı bulunamadı', 404);
            }

            $productCount = $this->repo->getActiveProductCount($vendor->id);

            $stats = [
                'product_count' => $productCount,
                'member_since' => $vendor->created_at->year,
                'follower_count' => 0, // TODO: Implement followers if needed
            ];

            return $this->successResponse([
                'vendor' => $vendor,
                'stats' => $stats,
            ], 'Satıcı profili getirildi');

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
            $vendor = $this->getActiveVendorOrFail($slug);
            if ($vendor instanceof ServiceResponse) {
                return $vendor;
            }

            $perPage = $filters['per_page'] ?? 20;
            $products = $this->repo->getVendorProducts($vendor->id, $filters, $perPage);

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
            $vendor = $this->getActiveVendorOrFail($slug);
            if ($vendor instanceof ServiceResponse) {
                return $vendor;
            }

            $categories = $this->repo->getVendorCategoriesWithCount($vendor->id);

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
            $vendor = $this->getActiveVendorOrFail($slug);
            if ($vendor instanceof ServiceResponse) {
                return $vendor;
            }

            $perPage = $filters['per_page'] ?? 10;
            $reviews = $this->repo->getVendorReviews($vendor->id, $filters, $perPage);
            $distribution = $this->repo->getReviewDistribution($vendor->id);

            return $this->successResponse([
                'reviews' => $reviews,
                'summary' => [
                    'average_rating' => round((float)($vendor->rating_avg ?? 0), 1),
                    'total_reviews' => $vendor->review_count ?? 0,
                    'distribution' => $distribution,
                ]
            ], 'Satıcı yorumları getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Satıcı yorumları alınamadı');
        }
    }

    /**
     * Get active vendor or return error response
     */
    protected function getActiveVendorOrFail(string $slug): Vendor|ServiceResponse
    {
        $vendor = $this->repo->findActiveBySlug($slug);

        if (!$vendor) {
            return $this->errorResponse('Satıcı bulunamadı', 404);
        }

        return $vendor;
    }
}
