<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Services\Admin\AdminOrderService;
use Illuminate\Http\Request;

class OrderController extends BaseAdminController
{
    protected AdminOrderService $service;

    public function __construct(AdminOrderService $service)
    {
        $this->service = $service;
    }

    /**
     * Get all orders
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'payment_status', 'min_amount', 'max_amount']);
        
        $result = $this->service->getOrders($filters);

        return $this->fromServiceResponse($result);
    }

    /**
     * Get order statistics
     */
    public function stats()
    {
        $result = $this->service->getOrderStats();

        return $this->fromServiceResponse($result);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, int $orderId)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,returned'
        ]);

        $result = $this->service->updateOrderStatus(
            $orderId,
            $request->input('status')
        );

        return $this->fromServiceResponse($result);
    }

    /**
     * Cancel order
     */
    public function cancel(int $orderId)
    {
        $result = $this->service->cancelOrder($orderId);

        return $this->fromServiceResponse($result);
    }
}
