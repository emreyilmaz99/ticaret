<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Requests\Api\V1\Admin\AddOrderNoteRequest;
use App\Http\Requests\Api\V1\Admin\CancelOrderRequest;
use App\Http\Requests\Api\V1\Admin\UpdateOrderStatusRequest;
use App\Interfaces\Services\Admin\AdminOrderServiceInterface;
use Illuminate\Http\Request;

class OrderController extends BaseAdminController
{
    protected AdminOrderServiceInterface $service;

    public function __construct(AdminOrderServiceInterface $service)
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
     * Show single order by ID or order number
     */
    public function show($orderNumberOrId)
    {
        // Try to find by order number first, then by ID
        $order = \App\Models\Order::where('order_number', $orderNumberOrId)
            ->orWhere('id', $orderNumberOrId)
            ->with(['user', 'items.product', 'items.vendor', 'statusHistory'])
            ->firstOrFail();

        return $this->success(['order' => $order], 'Sipariş başarıyla getirildi.');
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

