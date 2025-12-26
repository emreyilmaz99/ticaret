<?php

namespace App\Repositories\Interfaces;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Collection;

interface OrderItemRepositoryInterface
{
    public function create(array $data): OrderItem;
    public function findByIyzicoItemId(int $orderId, string $iyzicoItemId): ?OrderItem;
    public function update($id, array $data): OrderItem;
    public function getForOrder(int $orderId): Collection;
    public function findForOrder(int $orderItemId, int $orderId): ?OrderItem;
}
