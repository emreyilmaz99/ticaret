<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Services\Cart\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
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

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Sepete ürün ekle
     */
    public function addItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|string|exists:products,id',
            'variant_id' => 'nullable|integer|exists:product_variants,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->addItem($user, $sessionId, $validated);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Sepet öğesi miktarını güncelle
     */
    public function updateItem(Request $request, int $itemId): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->updateItem($user, $sessionId, $itemId, $validated['quantity']);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Sepetten ürün kaldır
     */
    public function removeItem(Request $request, int $itemId): JsonResponse
    {
        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->removeItem($user, $sessionId, $itemId);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Sepeti temizle
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->clearCart($user, $sessionId);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Kupon uygula
     */
    public function applyCoupon(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
        ]);

        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->applyCoupon($user, $sessionId, $validated['code']);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Kuponu kaldır
     */
    public function removeCoupon(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        $sessionId = $request->header('X-Cart-Session');

        $result = $this->cartService->removeCoupon($user, $sessionId);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
    }

    /**
     * Misafir sepetini kullanıcıya aktar (giriş yaptıktan sonra)
     */
    public function merge(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Giriş yapmanız gerekiyor',
            ], 401);
        }

        $sessionId = $request->header('X-Cart-Session') ?? $request->session_id;

        $result = $this->cartService->mergeCart($user, $sessionId);

        return response()->json([
            'success' => $result->isSuccess(),
            'message' => $result->getMessage(),
            'data' => $result->getData(),
        ], $result->getStatusCode());
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
