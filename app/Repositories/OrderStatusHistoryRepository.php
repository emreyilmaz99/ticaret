<?php

namespace App\Repositories;

use App\Models\OrderStatusHistory;

class OrderStatusHistoryRepository extends EloquentBaseRepository
{
    public function __construct(OrderStatusHistory $model)
    {
        parent::__construct($model);
    }

    /**
     * Create status history entry
     */
    public function create(array $data): OrderStatusHistory
    {
        return $this->model->create($data);
    }

    /**
     * Get history for order
     */
    public function getForOrder(int $orderId)
    {
        return $this->model
            ->where('order_id', $orderId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
