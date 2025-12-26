<?php

namespace App\Services\Order;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Interfaces\Services\Order\OrderPaymentServiceInterface;
use App\Services\BaseService;
use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Repositories\OrderItemRepository;
use App\Repositories\OrderStatusHistoryRepository;
use App\Services\Product\StockService;
use App\Services\Order\CouponService;
use App\Services\Cart\CartService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * OrderPaymentService
 * 
 * Handles payment processing and post-payment order updates.
 */
class OrderPaymentService extends BaseService implements OrderPaymentServiceInterface
{
    public function __construct(
        protected StockService $stockService,
        protected CouponService $couponService,
        protected CartService $cartService,
        protected OrderRepository $orderRepository,
        protected OrderItemRepository $orderItemRepository,
        protected OrderStatusHistoryRepository $statusHistoryRepository
    ) {}

    /**
     * Process successful payment
     */
    public function processPaymentSuccess(Order $order, array $data)
    {
        try {
            return DB::transaction(function () use ($order, $data) {
                $this->updateOrderWithPaymentData($order, $data);
                $this->updateOrderItemsWithPaymentData($order, $data);
                $this->handleStockDecrement($order);
                $this->recordCouponUsage($order);
                $this->clearUserCart($order);
                $this->createPaymentSuccessHistory($order, $data);

                Log::info('Payment successful', [
                    'order_id' => $order->id,
                    'payment_id' => $data['payment_id'],
                    'total' => $order->total,
                ]);

                $freshOrder = $this->orderRepository->findFreshWithItems($order->id);

                return $this->successResponse([
                    'order' => $freshOrder,
                    'payment_id' => $data['payment_id'],
                ], 'Ödeme başarılı');
            });
        } catch (\Exception $e) {
            Log::error('Payment processing failed', [
                'order_id' => $order->id ?? null,
                'error' => $e->getMessage(),
            ]);
            return $this->errorResponse('Ödeme işlenirken hata oluştu: ' . $e->getMessage());
        }
    }

    /**
     * Update order with payment data
     */
    protected function updateOrderWithPaymentData(Order $order, array $data): void
    {
        $this->orderRepository->update($order->id, [
            'iyzico_payment_id' => $data['payment_id'],
            'iyzico_fraud_status' => $data['fraud_status'],
            'iyzico_raw_response' => $data['raw_result'] ?? null,
            'card_type' => $data['card_type'],
            'card_association' => $data['card_association'],
            'card_family' => $data['card_family'],
            'card_bin' => $data['bin_number'],
            'card_last_four' => $data['last_four_digits'],
            'installment_count' => $data['installment'] ?? 1,
            'payment_status' => PaymentStatus::PAID->value,
            'status' => OrderStatus::CONFIRMED->value,
            'paid_at' => now(),
        ]);
    }

    /**
     * Update order items with payment transaction data
     */
    protected function updateOrderItemsWithPaymentData(Order $order, array $data): void
    {
        if (empty($data['payment_items'])) {
            return;
        }

        foreach ($data['payment_items'] as $paymentItem) {
            $orderItem = $this->orderItemRepository->findByIyzicoItemId($order->id, $paymentItem->getItemId());

            if ($orderItem) {
                $this->orderItemRepository->update($orderItem->id, [
                    'iyzico_payment_transaction_id' => $paymentItem->getPaymentTransactionId(),
                    'iyzico_transaction_status' => $paymentItem->getTransactionStatus(),
                ]);
            }
        }
    }

    /**
     * Handle stock decrement with error handling
     */
    protected function handleStockDecrement(Order $order): void
    {
        try {
            $this->stockService->decrementStocksForOrder($order);
        } catch (\App\Exceptions\InsufficientStockException $e) {
            Log::error('Insufficient stock after payment', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            $this->cancelOrderDueToStockIssue($order, $e->getMessage());

            throw new \App\Exceptions\BusinessLogicException(
                'Ödeme alındı ancak stok yetersiz. Siparişiniz iptal edildi, ücret iadesi yapılacaktır.',
                422
            );
        }
    }

    /**
     * Cancel order due to stock issue
     */
    protected function cancelOrderDueToStockIssue(Order $order, string $errorMessage): void
    {
        $this->orderRepository->update($order->id, [
            'status' => OrderStatus::CANCELLED->value,
            'payment_status' => PaymentStatus::FAILED->value,
        ]);

        $this->statusHistoryRepository->create([
            'order_id' => $order->id,
            'old_status' => OrderStatus::CONFIRMED->value,
            'new_status' => OrderStatus::CANCELLED->value,
            'note' => 'Stok yetersiz - Otomatik iptal: ' . $errorMessage,
            'changed_by_type' => 'system',
            'changed_by_id' => null,
        ]);
    }

    /**
     * Record coupon usage for order
     */
    protected function recordCouponUsage(Order $order): void
    {
        $this->couponService->recordUsageForOrder($order);
    }

    /**
     * Clear user's cart after successful payment
     */
    protected function clearUserCart(Order $order): void
    {
        $this->cartService->clearCartByUserId($order->user_id);
    }

    /**
     * Create payment success status history
     */
    protected function createPaymentSuccessHistory(Order $order, array $data): void
    {
        $this->statusHistoryRepository->create([
            'order_id' => $order->id,
            'old_status' => OrderStatus::PENDING->value,
            'new_status' => OrderStatus::CONFIRMED->value,
            'note' => 'Ödeme başarılı - Payment ID: ' . $data['payment_id'],
            'changed_by_type' => 'system',
            'changed_by_id' => null,
        ]);
    }
}
