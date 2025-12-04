<?php

namespace App\Repositories;

use App\Models\Favorite;
use App\Repositories\Interfaces\FavoriteRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FavoriteRepository extends EloquentBaseRepository implements FavoriteRepositoryInterface
{
    public function __construct(Favorite $model)
    {
        parent::__construct($model);
    }

    /**
     * Get user's favorites with pagination
     */
    public function getForUser(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        return $this->model
            ->with(['product' => function ($query) {
                $query->with([
                    'photos' => fn($q) => $q->orderBy('id')->limit(1),
                    'variants' => fn($q) => $q->orderBy('id')->limit(1),
                    'vendor:id,name,slug'
                ]);
            }])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Find favorite by user and product
     */
    public function findByUserAndProduct(int $userId, string $productId): ?Favorite
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
    }

    /**
     * Check if product is in user's favorites
     */
    public function exists(int $userId, string $productId): bool
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }

    /**
     * Add product to favorites
     */
    public function addFavorite(int $userId, string $productId): Favorite
    {
        return $this->model->create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);
    }

    /**
     * Remove product from favorites
     */
    public function removeFavorite(int $userId, string $productId): bool
    {
        return (bool) $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete();
    }

    /**
     * Get favorite product IDs for user
     */
    public function getFavoriteProductIds(int $userId, array $productIds = []): array
    {
        $query = $this->model->where('user_id', $userId);

        if (!empty($productIds)) {
            $query->whereIn('product_id', $productIds);
        }

        return $query->pluck('product_id')->toArray();
    }

    /**
     * Clear all favorites for user
     */
    public function clearForUser(int $userId): int
    {
        return $this->model->where('user_id', $userId)->delete();
    }

    /**
     * Count favorites for user
     */
    public function countForUser(int $userId): int
    {
        return $this->model->where('user_id', $userId)->count();
    }
}
