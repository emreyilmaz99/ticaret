<?php

namespace App\Interfaces\Services\Admin;

interface AdminOrderServiceInterface
{
    /**
     * Get orders (admin)
     */
    public function getOrders(array $filters = []);

    /**
     * Get order statistics
     */
    public function getOrderStats();

    /**
     * Update order status
     */
    public function updateOrderStatus(int $orderId, string $newStatus);

    /**
     * Cancel order
     */
    public function cancelOrder(int $orderId, string $reason = null, int $adminId = null);

    /**
     * Add order note
     */
    public function addNote(int $orderId, string $note, int $adminId, bool $visibleToVendor = true, bool $visibleToCustomer = false);

    /**
     * Get order notes
     */
    public function getNotes(int $orderId);

    /**
     * Get user orders
     */
    public function getUserOrders(int $userId, int $excludeOrderId = null);
}
