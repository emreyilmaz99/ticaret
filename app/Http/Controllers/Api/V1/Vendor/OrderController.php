<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Vendor\UpdateOrderStatusRequest;
use App\Interfaces\Services\Vendor\VendorOrderServiceInterface;
use Illuminate\Http\Request;

class OrderController extends BaseVendorController
{
    protected VendorOrderServiceInterface $service;

    public function __construct(VendorOrderServiceInterface $service)
    {
        $this->service = $service;
    }

    /**
     * Get vendor's orders with filters
     */
    public function index(Request $request)
    {
        $vendor = $request->user();
        if (!$vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status', 'all'),
            'min_amount' => $request->input('min_amount'),
            'max_amount' => $request->input('max_amount'),
        ];

        $result = $this->service->getVendorOrders($vendor->id, $filters);

        return $this->fromServiceResponse($result);
    }

    /**
     * Get order statistics
     */
    public function stats(Request $request)
    {
        $vendor = $request->user();
        if (!$vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $result = $this->service->getVendorOrderStats($vendor->id);

        return $this->fromServiceResponse($result);
    }

    /**
     * Show single order by ID or order number
     */
    public function show(Request $request, $orderNumberOrId)
    {
        $vendor = $request->user();
        if (!$vendor) {
            return $this->error('Yetkisiz', 401);
        }

        // Find order that contains vendor's products
        $order = \App\Models\Order::where('order_number', $orderNumberOrId)
            ->orWhere('id', $orderNumberOrId)
            ->whereHas('items', function($q) use ($vendor) {
                $q->where('vendor_id', $vendor->id);
            })
            ->with(['user', 'items' => function($q) use ($vendor) {
                $q->where('vendor_id', $vendor->id);
            }, 'items.product'])
            ->firstOrFail();

        return $this->success(['order' => $order], 'Sipariş başarıyla getirildi.');
    }

    /**
     * Update order status
     */
    public function updateStatus(UpdateOrderStatusRequest $request, int $orderId)
    {
        $vendor = $request->user();
        if (!$vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $result = $this->service->updateOrderStatus(
            $vendor->id,
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
        $vendor = $request->user();
        if (!$vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $result = $this->service->cancelOrder($vendor->id, $orderId);

        return $this->fromServiceResponse($result);
    }
}
