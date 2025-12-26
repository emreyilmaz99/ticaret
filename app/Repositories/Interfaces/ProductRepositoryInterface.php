<?php

namespace App\Repositories\Interfaces;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ProductRepositoryInterface
{
    public function create(array $data): Product;
    public function update($id, array $data): Product;
    public function findById($id): ?Product;
    public function delete($id): bool;
    public function findForVendor(int $vendorId, $productId): ?Product;
    public function listForVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator;
    public function existsBySlug(string $slug): bool;
    public function findActiveWithDeal(string $productId): ?Product;
    public function findWithFirstVariant(string $productId): ?Product;
    
    // Admin methods
    public function getFilteredForAdmin(array $filters, int $perPage = 15): LengthAwarePaginator;
    public function findWithAdminDetails(int|string $id): ?Product;
    public function updateStatus(int|string $id, array $data): ?Product;
    public function getStatistics(): array;
    
    // Public catalog methods
    public function getActivePublicProducts(array $filters = [], int $perPage = 12): LengthAwarePaginator;
    public function getFeaturedProducts(int $limit = 8);
    public function getRelatedProducts(string $productId, ?int $categoryId, int $limit = 4);
    public function findActiveBySlug(string $slug): ?Product;
    public function incrementViews(string $productId): void;
    public function syncTags(string $productId, array $tagIds): void;
    public function freshWithRelations(string $productId, array $relations = ['variants', 'tags', 'photos']): ?Product;
    public function bulkUpdateStatus(array $productIds, string $status): int;
    public function bulkUpdateWithData(array $productIds, array $data): int;
    
    // Extended public catalog methods
    public function getPublicProductsWithFilters(array $filters = [], int $perPage = 12): LengthAwarePaginator;
    public function getProductDetailBySlug(string $slug): ?Product;
    public function getRelatedProductsExtended(string $productId, ?int $categoryId, ?int $vendorId, int $limit = 4);
    public function getFeaturedProductsWithDeals(int $limit = 8);
    public function findActiveBySlugSimple(string $slug): ?Product;
    public function countActiveByVendor(int $vendorId): int;
}
