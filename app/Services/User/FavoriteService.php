<?php

namespace App\Services\User;

use App\Core\ServiceResponse;
use App\Models\Product;
use App\Repositories\Interfaces\FavoriteRepositoryInterface;
use App\Services\BaseService;
use App\Traits\FormatsProductData;
use Illuminate\Support\Facades\Cache;

class FavoriteService extends BaseService
{
    use FormatsProductData;
    
    protected FavoriteRepositoryInterface $favoriteRepo;
    protected const CACHE_TTL = 3600; // 1 hour

    public function __construct(FavoriteRepositoryInterface $favoriteRepo)
    {
        $this->favoriteRepo = $favoriteRepo;
    }

    /**
     * Get user's favorites
     */
    public function getFavorites(int $userId, int $perPage = 20): ServiceResponse
    {
        try {
            $favorites = $this->favoriteRepo->getForUser($userId, $perPage);

            $items = collect($favorites->items())->map(function ($favorite) {
                return $this->formatFavoriteItem($favorite);
            })->filter()->values();

            return $this->successResponse([
                'items' => $items,
                'pagination' => [
                    'current_page' => $favorites->currentPage(),
                    'last_page' => $favorites->lastPage(),
                    'per_page' => $favorites->perPage(),
                    'total' => $favorites->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Favoriler alınamadı');
        }
    }

    /**
     * Add product to favorites
     */
    public function addFavorite(int $userId, string $productId): ServiceResponse
    {
        try {
            // Check if already in favorites
            if ($this->favoriteRepo->exists($userId, $productId)) {
                return $this->errorResponse('Bu ürün zaten favorilerinizde', 400);
            }

            // Validate product using trait method
            $product = $this->validateActiveProduct($productId);

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            $this->favoriteRepo->addFavorite($userId, $productId);
            
            // Clear cache
            $this->clearUserCache($userId);

            return $this->successResponse(
                ['is_favorite' => true],
                'Ürün favorilere eklendi'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürün favorilere eklenemedi');
        }
    }

    /**
     * Remove product from favorites
     */
    public function removeFavorite(int $userId, string $productId): ServiceResponse
    {
        try {
            $deleted = $this->favoriteRepo->removeFavorite($userId, $productId);

            if (!$deleted) {
                return $this->errorResponse('Ürün favorilerde bulunamadı', 404);
            }
            
            // Clear cache
            $this->clearUserCache($userId);

            return $this->successResponse(
                ['is_favorite' => false],
                'Ürün favorilerden kaldırıldı'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürün favorilerden kaldırılamadı');
        }
    }

    /**
     * Toggle favorite status
     */
    public function toggleFavorite(int $userId, string $productId): ServiceResponse
    {
        try {
            $favorite = $this->favoriteRepo->findByUserAndProduct($userId, $productId);

            if ($favorite) {
                $this->favoriteRepo->removeFavorite($userId, $productId);
                $this->clearUserCache($userId);
                return $this->successResponse(
                    ['is_favorite' => false],
                    'Ürün favorilerden kaldırıldı'
                );
            }

            // Validate product using trait method
            $product = $this->validateActiveProduct($productId);

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            $this->favoriteRepo->addFavorite($userId, $productId);
            $this->clearUserCache($userId);

            return $this->successResponse(
                ['is_favorite' => true],
                'Ürün favorilere eklendi'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Favori durumu değiştirilemedi');
        }
    }

    /**
     * Check favorite status for multiple products
     */
    public function checkFavorites(int $userId, array $productIds): ServiceResponse
    {
        try {
            $favoriteIds = $this->favoriteRepo->getFavoriteProductIds($userId, $productIds);

            $result = [];
            foreach ($productIds as $id) {
                $result[$id] = in_array($id, $favoriteIds);
            }

            return $this->successResponse($result);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Favori durumu kontrol edilemedi');
        }
    }

    /**
     * Clear all favorites
     */
    public function clearFavorites(int $userId): ServiceResponse
    {
        try {
            $this->favoriteRepo->clearForUser($userId);
            $this->clearUserCache($userId);

            return $this->successResponse(null, 'Tüm favoriler temizlendi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Favoriler temizlenemedi');
        }
    }

    /**
     * Get favorites count (cached)
     */
    public function getCount(int $userId): ServiceResponse
    {
        try {
            $count = Cache::remember(
                $this->getCountCacheKey($userId),
                self::CACHE_TTL,
                fn() => $this->favoriteRepo->countForUser($userId)
            );

            return $this->successResponse(['count' => $count]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Favori sayısı alınamadı');
        }
    }

    /**
     * Format favorite item for response
     */
    protected function formatFavoriteItem($favorite): ?array
    {
        $product = $favorite->product;
        if (!$product) {
            return null;
        }

        $mainPhoto = $product->photos->sortBy('sort_order')->first();
        $firstVariant = $product->variants->first();
        
        // Use trait method for image URL
        $imageUrl = $this->formatImageUrl($mainPhoto);
        
        // Get price info including featured deals
        $priceInfo = $this->getProductPriceInfo($product, $firstVariant);

        return [
            'id' => $favorite->id,
            'added_at' => $favorite->created_at->toISOString(),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image' => $imageUrl,
                'price' => $priceInfo['current_price'],
                'original_price' => $priceInfo['original_price'],
                'discount_percentage' => $priceInfo['discount_percentage'],
                'has_deal' => $priceInfo['has_deal'],
                'deal_badge' => $priceInfo['deal_badge'],
                'stock' => $firstVariant?->stock ?? 0,
                'in_stock' => $this->isProductInStock($product),
                'vendor' => $product->vendor ? [
                    'id' => $product->vendor->id,
                    'name' => $product->vendor->name,
                    'slug' => $product->vendor->slug,
                ] : null,
            ],
        ];
    }
    
    /**
     * Get cache key for favorite count
     */
    protected function getCountCacheKey(int $userId): string
    {
        return "user:{$userId}:favorites:count";
    }
    
    /**
     * Clear all cache for a user
     */
    protected function clearUserCache(int $userId): void
    {
        Cache::forget($this->getCountCacheKey($userId));
    }
}
