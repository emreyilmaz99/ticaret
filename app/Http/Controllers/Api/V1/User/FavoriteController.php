<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\ToggleFavoriteRequest;
use App\Http\Requests\Api\V1\User\CheckFavoritesRequest;
use App\Services\User\FavoriteService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected FavoriteService $favoriteService
    ) {}

    /**
     * Kullanıcının favorilerini listele
     */
    public function index(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->favoriteService->getFavorites($request->user()->id, $request->integer('per_page', 20))
        );
    }

    /**
     * Ürünü favorilere ekle
     */
    public function store(ToggleFavoriteRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->favoriteService->addFavorite($request->user()->id, $request->product_id)
        );
    }

    /**
     * Ürünü favorilerden kaldır
     */
    public function destroy(Request $request, string $productId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->favoriteService->removeFavorite($request->user()->id, $productId)
        );
    }

    /**
     * Favori durumunu toggle et (ekle/kaldır)
     */
    public function toggle(ToggleFavoriteRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->favoriteService->toggleFavorite($request->user()->id, $request->product_id)
        );
    }

    /**
     * Belirli ürünlerin favori durumlarını kontrol et
     */
    public function check(CheckFavoritesRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->favoriteService->checkFavorites($request->user()->id, $request->product_ids)
        );
    }

    /**
     * Tüm favorileri temizle
     */
    public function clear(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->favoriteService->clearFavorites($request->user()->id)
        );
    }

    /**
     * Favori sayısını getir
     */
    public function count(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->favoriteService->getCount($request->user()->id)
        );
    }
}
