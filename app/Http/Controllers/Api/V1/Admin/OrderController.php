<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Requests\Api\V1\Admin\AddOrderNoteRequest;
use App\Http\Requests\Api\V1\Admin\CancelOrderRequest;
use App\Http\Requests\Api\V1\Admin\UpdateOrderStatusRequest;
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
    public function updateStatus(UpdateOrderStatusRequest $request, int $orderId)
    {
        $result = $this->service->updateOrderStatus(
            $orderId,
            $request->input('status')
        );

        return $this->fromServiceResponse($result);
    }

    /**
     * Cancel order
     */
    public function cancel(CancelOrderRequest $request, int $orderId)
    {
        $adminId = $request->user()->id;
        $result = $this->service->cancelOrder($orderId, $request->reason, $adminId);

        return $this->fromServiceResponse($result);
    }

    /**
     * Add note to order
     */
    public function addNote(AddOrderNoteRequest $request, int $orderId)
    {
        $adminId = $request->user()->id;
        $note = $this->service->addNote(
            $orderId,
            $request->note,
            $adminId,
            $request->input('is_visible_to_vendor', true),
            $request->input('is_visible_to_customer', false)
        );

        return $this->success(
            ['note' => $note],
            'Not başarıyla eklendi'
        );
    }

    /**
     * Get order notes
     */
    public function getNotes(int $orderId)
    {
        $notes = $this->service->getNotes($orderId);

        return $this->success(
            ['notes' => $notes],
            'Sipariş notları başarıyla getirildi.'
        );
    }

    /**
     * Get user's other orders
     */
    public function getUserOrders(int $orderId)
    {
        $order = \App\Models\Order::findOrFail($orderId);
        $orders = $this->service->getUserOrders($order->user_id, $orderId);

        return $this->success(
            ['orders' => $orders],
            'Kullanıcı siparişleri başarıyla getirildi.'
        );
    }
}

