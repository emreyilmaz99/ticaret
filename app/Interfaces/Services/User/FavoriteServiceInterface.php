<?php

namespace App\Interfaces\Services\User;

use App\Core\ServiceResponse;

interface FavoriteServiceInterface
{
    /**
     * Get user's favorites
     */
    public function getFavorites(int $userId, int $perPage = 20): ServiceResponse;

    /**
     * Add product to favorites
     */
    public function addFavorite(int $userId, string $productId): ServiceResponse;

    /**
     * Remove product from favorites
     */
    public function removeFavorite(int $userId, string $productId): ServiceResponse;

    /**
     * Toggle favorite status
     */
    public function toggleFavorite(int $userId, string $productId): ServiceResponse;

    /**
     * Check if products are favorited
     */
    public function checkFavorites(int $userId, array $productIds): ServiceResponse;

    /**
     * Clear all favorites
     */
    public function clearFavorites(int $userId): ServiceResponse;

    /**
     * Get favorites count
     */
    public function getCount(int $userId): ServiceResponse;
}
