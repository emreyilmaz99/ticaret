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
