<?php

namespace App\Repositories;

use App\Models\VendorEarning;
use App\Models\OrderItem;

class VendorEarningRepository extends EloquentBaseRepository
{
    public function __construct(VendorEarning $model)
    {
        parent::__construct($model);
    }

    /**
     * Create vendor earning
     */
    public function create(array $data): VendorEarning
    {
        return $this->model->create($data);
    }

    /**
     * Check if earning exists for order item
     */
    public function existsForOrderItem(int $orderItemId): bool
    {
        return $this->model->where('order_item_id', $orderItemId)->exists();
    }

    /**
     * Create earning from order item
     */
    public function createFromOrderItem(OrderItem $orderItem): VendorEarning
    {
        return VendorEarning::createFromOrderItem($orderItem);
    }

    /**
     * Get earnings for vendor
     */
    public function getForVendor(int $vendorId, int $perPage = 15)
    {
        return $this->model
            ->where('vendor_id', $vendorId)
            ->with(['orderItem.order'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get pending earnings for vendor
     */
    public function getPendingForVendor(int $vendorId)
    {
        return $this->model
            ->where('vendor_id', $vendorId)
            ->where('status', 'pending')
            ->get();
    }
}
