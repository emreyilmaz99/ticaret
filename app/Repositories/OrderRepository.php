<?php

namespace App\Repositories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class OrderRepository implements OrderRepositoryInterface
{
    public function __construct(
        protected Order $model
    ) {}

    /**
     * Get filtered orders with relationships
     */
    public function getWithFilters(array $filters = []): Collection
    {
        $query = $this->model->with([
            'user:id,name,email',
            'coupon:id,code,discount_amount,min_order_amount',
            'items.product:id,name,slug,vendor_id,tax_class_id',
            'items.product.photos:id,product_id,url,sort_order',
            'items.product.vendor:id,company_name,email,phone,tax_id,commission_plan_id',
            'items.product.vendor.commissionPlan:id,rate',
            'items.product.taxClass:id,name,rate',
            'items.variant:id,title,sku',
            'statusHistory'
        ])->orderBy('created_at', 'desc');

        // Search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Status filter
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // Payment status filter
        if (!empty($filters['payment_status']) && $filters['payment_status'] !== 'all') {
            $query->where('payment_status', $filters['payment_status']);
        }

        // Amount range filters
        if (!empty($filters['min_amount'])) {
            $query->where('total', '>=', $filters['min_amount']);
        }

        if (!empty($filters['max_amount'])) {
            $query->where('total', '<=', $filters['max_amount']);
        }

        return $query->get();
    }

    /**
     * Find order by ID with relationships
     */
    public function find(int $id): ?Order
    {
        return $this->model->with([
            'user',
            'items.product.vendor',
            'items.product.taxClass',
            'items.variant',
            'statusHistory',
            'coupon'
        ])->find($id);
    }

    /**
     * Find order by order number
     */
    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return $this->model->with([
            'user',
            'items.product.vendor',
            'items.product.taxClass',
            'items.variant',
            'statusHistory'
        ])->where('order_number', $orderNumber)->first();
    }

    /**
     * Update order status
     */
    public function updateStatus(int $id, string $status): Order
    {
        $order = $this->model->findOrFail($id);
        $order->update(['status' => $status]);
        return $order->fresh();
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(int $id, string $paymentStatus): Order
    {
        $order = $this->model->findOrFail($id);
        $order->update(['payment_status' => $paymentStatus]);
        return $order->fresh();
    }

    /**
     * Get order statistics
     */
    public function getStatistics(array $filters = []): array
    {
        $query = $this->model->query();

        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        return [
            'total' => $query->count(),
            'pending' => (clone $query)->where('status', OrderStatus::PENDING->value)->count(),
            'processing' => (clone $query)->where('status', OrderStatus::PROCESSING->value)->count(),
            'completed' => (clone $query)->where('status', OrderStatus::COMPLETED->value)->count(),
            'cancelled' => (clone $query)->where('status', OrderStatus::CANCELLED->value)->count(),
            'total_revenue' => (clone $query)->where('payment_status', PaymentStatus::PAID->value)->sum('total'),
            'pending_payment' => (clone $query)->where('payment_status', PaymentStatus::PENDING->value)->sum('total'),
        ];
    }

    /**
     * Get user orders with pagination
     */
    public function getUserOrders(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with(['items.product', 'items.variant'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get vendor orders
     */
    public function getVendorOrders(int $vendorId, array $filters = []): Collection
    {
        $query = $this->model->with(['user', 'items' => function ($q) use ($vendorId) {
            $q->where('vendor_id', $vendorId);
        }, 'items.product', 'items.variant'])
            ->whereHas('items', function ($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })
            ->orderBy('created_at', 'desc');

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        return $query->get();
    }

    /**
     * Get order count
     */
    public function count(): int
    {
        return $this->model->count();
    }

    /**
     * Count orders by status
     */
    public function countByStatus(string $status): int
    {
        return $this->model->where('status', $status)->count();
    }

    /**
     * Find order by ID (basic)
     */
    public function findById(int $id): ?Order
    {
        return $this->model->find($id);
    }

    /**
     * Get user orders limited (for admin view)
     */
    public function getUserOrdersLimited(int $userId, ?int $excludeOrderId = null, int $limit = 10): Collection
    {
        $query = $this->model->where('user_id', $userId)
            ->select('id', 'order_number', 'status', 'payment_status', 'total', 'created_at')
            ->orderBy('created_at', 'desc');

        if ($excludeOrderId) {
            $query->where('id', '!=', $excludeOrderId);
        }

        return $query->limit($limit)->get();
    }

    /**
     * Create order
     */
    public function create(array $data): Order
    {
        return $this->model->create($data);
    }

    /**
     * Update order
     */
    public function update(int $id, array $data): Order
    {
        $order = $this->model->findOrFail($id);
        $order->update($data);
        return $order->refresh();
    }

    /**
     * Find by iyzico token
     */
    public function findByIyzicoToken(string $token): ?Order
    {
        return $this->model->where('iyzico_token', $token)->first();
    }

    /**
     * Find pending order for user (duplicate prevention)
     */
    public function findRecentPendingForUser(int $userId, int $minutes = 5): ?Order
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('payment_status', PaymentStatus::PENDING->value)
            ->where('created_at', '>=', now()->subMinutes($minutes))
            ->latest()
            ->first();
    }

    /**
     * Get user orders paginated with items
     */
    public function getUserOrdersPaginated(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model
            ->where('user_id', $userId)
            ->with(['items.product.photos'])
            ->withCount('items')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Find user order by order number with full details
     */
    public function findUserOrderByNumber(int $userId, string $orderNumber): ?Order
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('order_number', $orderNumber)
            ->with([
                'user:id,name,email,phone',
                'items.product.photos',
                'items.product.taxClass',
                'items.product.vendor:id,company_name,tax_id,phone,email',
                'items.product.vendor.commissionPlan',
                'items.variant',
                'statusHistory',
                'coupon'
            ])
            ->first();
    }

    /**
     * Find fresh order with items
     */
    public function findFreshWithItems(int $id): ?Order
    {
        return $this->model->with('items')->find($id);
    }

    /**
     * Load order with items for payment processing
     */
    public function loadWithItemsForPayment(Order $order): Order
    {
        return $order->load([
            'items.product.vendor',
            'items.variant'
        ]);
    }

    /**
     * Update order status with history tracking
     * Uses model's updateStatus method which triggers Observer for status history
     */
    public function updateStatusWithHistory(
        int $id, 
        string $newStatus, 
        ?string $note = null, 
        ?string $changedByType = null, 
        ?int $changedById = null
    ): bool {
        $order = $this->model->findOrFail($id);
        return $order->updateStatus($newStatus, $note, $changedByType, $changedById);
    }

    /**
     * Load order with items and variants for stock operations
     */
    public function loadWithItemsAndVariants(Order $order): Order
    {
        return $order->load('items.variant');
    }

    /**
     * Find order for user with validation
     */
    public function findForUser(int $orderId, int $userId): ?Order
    {
        return $this->model
            ->where('id', $orderId)
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Get delivered orders for user with items for review
     */
    public function getDeliveredForUserWithItems(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('status', 'delivered')
            ->with(['items.product.photos', 'items.review'])
            ->latest()
            ->get();
    }
}
