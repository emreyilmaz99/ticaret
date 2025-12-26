<?php

namespace App\Repositories\Interfaces;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface OrderRepositoryInterface
{
    public function getWithFilters(array $filters = []): Collection;
    public function find(int $id): ?Order;
    public function findById(int $id): ?Order;
    public function findByOrderNumber(string $orderNumber): ?Order;
    public function updateStatus(int $id, string $status): Order;
    public function updatePaymentStatus(int $id, string $paymentStatus): Order;
    public function getStatistics(array $filters = []): array;
    public function getUserOrders(int $userId, int $perPage = 15): LengthAwarePaginator;
    public function getVendorOrders(int $vendorId, array $filters = []): Collection;
    public function count(): int;
    public function countByStatus(string $status): int;
    public function getUserOrdersLimited(int $userId, ?int $excludeOrderId = null, int $limit = 10): Collection;
    public function create(array $data): Order;
    public function update(int $id, array $data): Order;
    public function findByIyzicoToken(string $token): ?Order;
    public function findRecentPendingForUser(int $userId, int $minutes = 5): ?Order;
    public function getUserOrdersPaginated(int $userId, int $perPage = 10): LengthAwarePaginator;
    public function findUserOrderByNumber(int $userId, string $orderNumber): ?Order;
    public function findFreshWithItems(int $id): ?Order;
    public function loadWithItemsForPayment(Order $order): Order;
    public function updateStatusWithHistory(int $id, string $newStatus, ?string $note = null, ?string $changedByType = null, ?int $changedById = null): bool;
    public function loadWithItemsAndVariants(Order $order): Order;
    public function findForUser(int $orderId, int $userId): ?Order;
    public function getDeliveredForUserWithItems(int $userId): Collection;
}
