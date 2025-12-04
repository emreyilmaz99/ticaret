<?php

namespace App\Repositories\Interfaces;

use App\Models\Favorite;
use App\Repositories\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface FavoriteRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get user's favorites with pagination
     */
    public function getForUser(int $userId, int $perPage = 20): LengthAwarePaginator;

    /**
     * Find favorite by user and product
     */
    public function findByUserAndProduct(int $userId, string $productId): ?Favorite;

    /**
     * Check if product is in user's favorites
     */
    public function exists(int $userId, string $productId): bool;

    /**
     * Add product to favorites
     */
    public function addFavorite(int $userId, string $productId): Favorite;

    /**
     * Remove product from favorites
     */
    public function removeFavorite(int $userId, string $productId): bool;

    /**
     * Get favorite product IDs for user
     */
    public function getFavoriteProductIds(int $userId, array $productIds = []): array;

    /**
     * Clear all favorites for user
     */
    public function clearForUser(int $userId): int;

    /**
     * Count favorites for user
     */
    public function countForUser(int $userId): int;
}
