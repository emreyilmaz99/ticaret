<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\PublicRequests\AddCartItemRequest;
use App\Http\Requests\Api\V1\PublicRequests\UpdateCartItemRequest;
use App\Http\Requests\Api\V1\PublicRequests\ApplyCouponRequest;
use App\Interfaces\Services\Cart\CartServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ResponseHttp;
    
    protected CartServiceInterface $cartService;

    public function __construct(CartServiceInterface $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Sepeti getir
     */
    public function index(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->getCart($user, $sessionId);

        return $this->fromServiceResponse($result);
    }

    /**
     * Sepete ürün ekle
     */
    public function addItem(AddCartItemRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->addItem($user, $sessionId, $validated);

        return $this->fromServiceResponse($result);
    }

    /**
     * Sepet öğesi miktarını güncelle
     */
    public function updateItem(UpdateCartItemRequest $request, int $itemId): JsonResponse
    {
        $validated = $request->validated();

        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->updateItem($user, $sessionId, $itemId, $validated['quantity']);

        return $this->fromServiceResponse($result);
    }

    /**
     * Sepetten ürün kaldır
     */
    public function removeItem(Request $request, int $itemId): JsonResponse
    {
        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->removeItem($user, $sessionId, $itemId);

        return $this->fromServiceResponse($result);
    }

    /**
     * Sepeti temizle
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->clearCart($user, $sessionId);

        return $this->fromServiceResponse($result);
    }

    /**
     * Kupon uygula
     */
    public function applyCoupon(ApplyCouponRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->applyCoupon($user, $sessionId, $validated['code']);

        return $this->fromServiceResponse($result);
    }

    /**
     * Kuponu kaldır
     */
    public function removeCoupon(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->removeCoupon($user, $sessionId);

        return $this->fromServiceResponse($result);
    }

    /**
     * Misafir sepetini kullanıcıya aktar (giriş yaptıktan sonra)
     */
    public function merge(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);

        if (!$user) {
            return $this->error('Giriş yapmanız gerekiyor', 401);
        }

        $sessionId = $request->header('X-Cart-Session') ?? $request->session_id;

        $result = $this->cartService->mergeCart($user, $sessionId);

        return $this->fromServiceResponse($result);
    }

    /**
     * Get authenticated user if token exists
     */
    private function getAuthUser(Request $request)
    {
        if ($request->bearerToken()) {
            return auth('sanctum')->user();
        }
        return null;
    }
}
