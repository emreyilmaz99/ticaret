<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Kullanıcının siparişlerini listele
     * GET /api/user/orders
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product.photos'])
            ->withCount('items')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders->items(),
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
            ],
        ]);
    }

    /**
     * Sipariş detayını göster
     * GET /api/user/orders/{orderNumber}
     */
    public function show(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('user_id', $user->id)
            ->where('order_number', $orderNumber)
            ->with(['items.product.photos', 'statusHistory'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Sipariş bulunamadı',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order,
            ],
        ]);
    }

    /**
     * Siparişi iptal et
     * POST /api/user/orders/{orderNumber}/cancel
     */
    public function cancel(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('user_id', $user->id)
            ->where('order_number', $orderNumber)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Sipariş bulunamadı',
            ], 404);
        }

        if (!$order->isCancellable()) {
            return response()->json([
                'success' => false,
                'message' => 'Bu sipariş iptal edilemez',
            ], 400);
        }

        $order->updateStatus(
            Order::STATUS_CANCELLED,
            'Kullanıcı tarafından iptal edildi',
            'user',
            $user->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Sipariş iptal edildi',
            'data' => [
                'order' => $order->fresh(),
            ],
        ]);
    }
}
