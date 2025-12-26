<?php

namespace App\Repositories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Repositories\Interfaces\OrderItemRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class OrderItemRepository extends EloquentBaseRepository implements OrderItemRepositoryInterface
{
    public function __construct(OrderItem $model)
    {
        parent::__construct($model);
    }

    /**
     * Create order item
     */
    public function create(array $data): OrderItem
    {
        return $this->model->create($data);
    }

    /**
     * Find by iyzico item ID for order
     */
    public function findByIyzicoItemId(int $orderId, string $iyzicoItemId): ?OrderItem
    {
        return $this->model
            ->where('order_id', $orderId)
            ->where('iyzico_item_id', $iyzicoItemId)
            ->first();
    }

    /**
     * Update order item
     */
    public function update($id, array $data): OrderItem
    {
        $item = $this->model->findOrFail($id);
        $item->update($data);
        return $item->refresh();
    }

    /**
     * Get items for order
     */
    public function getForOrder(int $orderId): Collection
    {
        return $this->model
            ->where('order_id', $orderId)
            ->with(['product', 'variant'])
            ->get();
    }

    /**
     * Find order item for order
     */
    public function findForOrder(int $orderItemId, int $orderId): ?OrderItem
    {
        return $this->model
            ->where('id', $orderItemId)
            ->where('order_id', $orderId)
            ->first();
    }
}
