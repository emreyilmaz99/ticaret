<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Services\Order\OrderService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected OrderService $orderService
    ) {}
    /**
     * Kullanıcının siparişlerini listele
     * GET /api/user/orders
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->orderService->getUserOrders(
            $request->user()->id,
            $request->integer('per_page', 10)
        );

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $orders = $result->getData();

        return $this->success([
            'orders' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ], 'Siparişler getirildi');
    }

    /**
     * Sipariş detayını göster
     * GET /api/user/orders/{orderNumber}
     */
    public function show(Request $request, string $orderNumber): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->orderService->getUserOrder($request->user()->id, $orderNumber)
        );
    }

    /**
     * Siparişi iptal et
     * POST /api/user/orders/{orderNumber}/cancel
     */
    public function cancel(Request $request, string $orderNumber): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->orderService->cancelOrder($request->user()->id, $orderNumber)
        );
    }
}
