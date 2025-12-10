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
    public function cancel(Request $request, int $orderId)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $adminId = $request->user()->id;
        $result = $this->service->cancelOrder($orderId, $request->reason, $adminId);

        return $this->fromServiceResponse($result);
    }

    /**
     * Add note to order
     */
    public function addNote(Request $request, int $orderId)
    {
        $request->validate([
            'note' => 'required|string|max:1000',
            'is_visible_to_vendor' => 'boolean',
            'is_visible_to_customer' => 'boolean',
        ]);

        $adminId = $request->user()->id;
        $note = $this->service->addNote(
            $orderId,
            $request->note,
            $adminId,
            $request->input('is_visible_to_vendor', true),
            $request->input('is_visible_to_customer', false)
        );

        return response()->json([
            'success' => true,
            'message' => 'Not başarıyla eklendi',
            'data' => ['note' => $note]
        ]);
    }

    /**
     * Get order notes
     */
    public function getNotes(int $orderId)
    {
        $notes = $this->service->getNotes($orderId);

        return response()->json([
            'success' => true,
            'data' => ['notes' => $notes]
        ]);
    }
}

