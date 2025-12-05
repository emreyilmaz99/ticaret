<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\ToggleFavoriteRequest;
use App\Http\Requests\Api\V1\User\CheckFavoritesRequest;
use App\Services\FavoriteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function __construct(
        protected FavoriteService $favoriteService
    ) {}

    /**
     * Kullanıcının favorilerini listele
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = $request->integer('per_page', 20);
        
        $result = $this->favoriteService->getFavorites($user->id, $perPage);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'data' => $result->getData(),
            'message' => $result->getMessage(),
        ], $result->getStatusCode());
    }

    /**
     * Ürünü favorilere ekle
     */
    public function store(ToggleFavoriteRequest $request): JsonResponse
    {
        $user = $request->user();
        $result = $this->favoriteService->addFavorite($user->id, $request->product_id);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Ürünü favorilerden kaldır
     */
    public function destroy(Request $request, string $productId): JsonResponse
    {
        $user = $request->user();
        $result = $this->favoriteService->removeFavorite($user->id, $productId);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Favori durumunu toggle et (ekle/kaldır)
     */
    public function toggle(ToggleFavoriteRequest $request): JsonResponse
    {
        $user = $request->user();
        $result = $this->favoriteService->toggleFavorite($user->id, $request->product_id);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Belirli ürünlerin favori durumlarını kontrol et
     */
    public function check(CheckFavoritesRequest $request): JsonResponse
    {
        $user = $request->user();
        $result = $this->favoriteService->checkFavorites($user->id, $request->product_ids);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Tüm favorileri temizle
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user();
        $result = $this->favoriteService->clearFavorites($user->id);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
        ], $result->getStatusCode());
    }

    /**
     * Favori sayısını getir
     */
    public function count(Request $request): JsonResponse
    {
        $user = $request->user();
        $result = $this->favoriteService->getCount($user->id);
        
        return response()->json([
            'success' => $result->isSuccess(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }
}
