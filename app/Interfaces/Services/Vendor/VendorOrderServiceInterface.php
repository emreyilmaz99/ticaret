<?php

namespace App\Interfaces\Services\Vendor;

interface VendorOrderServiceInterface
{
    /**
     * Get vendor orders
     */
    public function getVendorOrders(int $vendorId, array $filters = []);

    /**
     * Get vendor order statistics
     */
    public function getVendorOrderStats(int $vendorId);

    /**
     * Update order status
     */
    public function updateOrderStatus(int $vendorId, int $orderId, string $newStatus);

    /**
     * Cancel order
     */
    public function cancelOrder(int $vendorId, int $orderId);
}
