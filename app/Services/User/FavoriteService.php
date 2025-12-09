<?php

namespace App\Services\User;

use App\Core\ServiceResponse;
use App\Models\Product;
use App\Repositories\Interfaces\FavoriteRepositoryInterface;
use App\Services\BaseService;

class FavoriteService extends BaseService
{
    protected FavoriteRepositoryInterface $favoriteRepo;

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

            // Validate product
            $product = Product::where('id', $productId)
                ->where('status', 'active')
                ->first();

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            $this->favoriteRepo->addFavorite($userId, $productId);

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
                return $this->successResponse(
                    ['is_favorite' => false],
                    'Ürün favorilerden kaldırıldı'
                );
            }

            // Validate product
            $product = Product::where('id', $productId)
                ->where('status', 'active')
                ->first();

            if (!$product) {
                return $this->errorResponse('Ürün bulunamadı', 404);
            }

            $this->favoriteRepo->addFavorite($userId, $productId);

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

            return $this->successResponse(null, 'Tüm favoriler temizlendi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Favoriler temizlenemedi');
        }
    }

    /**
     * Get favorites count
     */
    public function getCount(int $userId): ServiceResponse
    {
        try {
            $count = $this->favoriteRepo->countForUser($userId);

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

        $mainPhoto = $product->photos->first();
        $firstVariant = $product->variants->first();
        
        // Resim URL'sini düzgün şekilde oluştur
        $imageUrl = null;
        if ($mainPhoto) {
            // Önce path'i kontrol et, çünkü url zaten /storage/... formatında olabilir
            if ($mainPhoto->path) {
                $imageUrl = url('storage/' . $mainPhoto->path);
            } elseif ($mainPhoto->url) {
                // URL tam bir URL mi kontrol et
                if (filter_var($mainPhoto->url, FILTER_VALIDATE_URL)) {
                    $imageUrl = $mainPhoto->url;
                } else {
                    // Göreceli URL ise tam URL'e çevir
                    $imageUrl = url(ltrim($mainPhoto->url, '/'));
                }
            }
        }

        return [
            'id' => $favorite->id,
            'added_at' => $favorite->created_at->toISOString(),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image' => $imageUrl,
                'price' => $firstVariant?->price ?? 0,
                'compare_price' => $firstVariant?->compare_price,
                'stock' => $firstVariant?->stock ?? 0,
                'in_stock' => ($firstVariant?->stock ?? 0) > 0,
                'vendor' => $product->vendor ? [
                    'id' => $product->vendor->id,
                    'name' => $product->vendor->name,
                    'slug' => $product->vendor->slug,
                ] : null,
            ],
        ];
    }
}
