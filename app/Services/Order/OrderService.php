<?php

namespace App\Services\Order;

use App\Interfaces\Services\Order\OrderServiceInterface;
use App\Services\BaseService;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;

/**
 * OrderService (Facade)
 * 
 * Main entry point for order operations.
 * Delegates to specialized sub-services.
 * 
 * @deprecated Use OrderValidationService, OrderCreationService, or OrderPaymentService directly
 */
class OrderService extends BaseService implements OrderServiceInterface
{
    protected OrderValidationService $validationService;
    protected OrderCreationService $creationService;
    protected OrderPaymentService $paymentService;

    public function __construct(
        OrderValidationService $validationService,
        OrderCreationService $creationService,
        OrderPaymentService $paymentService
    ) {
        $this->validationService = $validationService;
        $this->creationService = $creationService;
        $this->paymentService = $paymentService;
    }

    /**
     * Validate cart before order creation
     * 
     * @deprecated Use OrderValidationService::validateCart() directly
     */
    public function validateCart(Cart $cart)
    {
        return $this->validationService->validateCart($cart);
    }

    /**
     * Create order from cart
     * 
     * @deprecated Use OrderCreationService::createOrderFromCart() directly
     */
    public function createOrderFromCart(User $user, Cart $cart, UserAddress $shippingAddress, ?UserAddress $billingAddress = null)
    {
        return $this->creationService->createOrderFromCart($user, $cart, $shippingAddress, $billingAddress);
    }

    /**
     * Process successful payment
     * 
     * @deprecated Use OrderPaymentService::processPaymentSuccess() directly
     */
    public function processPaymentSuccess(Order $order, $data)
    {
        return $this->paymentService->processPaymentSuccess($order, $data);
    }

    // ==================== User Order Methods ====================

    /**
     * Get user's orders with pagination
     */
    public function getUserOrders(int $userId, int $perPage = 10)
    {
        try {
            $orders = Order::where('user_id', $userId)
                ->with(['items.product.photos'])
                ->withCount('items')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return $this->successResponse($orders, 'Siparişler getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Siparişler alınamadı');
        }
    }

    /**
     * Get order by order number for user
     */
    public function getUserOrder(int $userId, string $orderNumber)
    {
        try {
            $order = Order::where('user_id', $userId)
                ->where('order_number', $orderNumber)
                ->with([
                    'items.product.photos',
                    'items.product.taxClass',
                    'items.product.vendor.commissionPlan',
                    'items.variant',
                    'statusHistory',
                    'coupon'
                ])
                ->first();

            if (!$order) {
                return $this->errorResponse('Sipariş bulunamadı', 404);
            }

            // Calculate totals and tax
            $totalBeforeDiscount = $order->items->sum('line_total');
            $couponDiscount = (float) ($order->coupon_discount ?? 0);
            
            $totalTax = $order->items->sum(function ($item) use ($totalBeforeDiscount, $couponDiscount) {
                $taxRate = $item->product?->taxClass?->rate ?? 0;
                $originalPrice = (float) $item->line_total;
                
                $itemCouponDiscount = 0;
                if ($totalBeforeDiscount > 0 && $couponDiscount > 0) {
                    $itemCouponDiscount = ($originalPrice / $totalBeforeDiscount) * $couponDiscount;
                }
                $priceAfterCoupon = $originalPrice - $itemCouponDiscount;
                
                return ($priceAfterCoupon * $taxRate) / (100 + $taxRate);
            });

            $transformedOrder = [
                'order_number' => $order->order_number,
                'order_id' => $order->id,
                'date' => $order->created_at->format('d M Y, H:i'),
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'amount' => (float) $order->total,
                'subtotal' => (float) ($order->subtotal ?: $totalBeforeDiscount),
                'tax_amount' => round($totalTax, 2),
                'coupon_discount' => $couponDiscount,
                'coupon_code' => $order->coupon_code ?? null,
                'coupon' => $order->coupon ? [
                    'code' => $order->coupon->code,
                    'discount_amount' => $order->coupon->discount_amount,
                    'min_order_amount' => $order->coupon->min_order_amount,
                ] : null,
                'shipping_address' => $order->shipping_address,
                'billing_address' => $order->billing_address,
                'shipping_cost' => (float) ($order->shipping_total ?? 0),
                'payment_method' => $order->payment_method,
                'products' => $order->items->map(function ($item) use ($totalBeforeDiscount, $couponDiscount) {
                    $imageUrl = $item->product?->photos?->first()?->file_path ?? 'https://via.placeholder.com/200';
                    
                    $originalPrice = (float) $item->line_total;
                    $itemCouponDiscount = 0;
                    if ($totalBeforeDiscount > 0 && $couponDiscount > 0) {
                        $itemCouponDiscount = ($originalPrice / $totalBeforeDiscount) * $couponDiscount;
                    }
                    $priceAfterCoupon = $originalPrice - $itemCouponDiscount;
                    
                    $taxRate = (float) ($item->product?->taxClass?->rate ?? 0);
                    $priceWithoutTax = $priceAfterCoupon / (1 + ($taxRate / 100));
                    $taxAmount = $priceAfterCoupon - $priceWithoutTax;
                    
                    return [
                        'id' => $item->product_id,
                        'name' => $item->product_name,
                        'slug' => $item->product?->slug ?? '',
                        'image' => $imageUrl,
                        'variant' => $item->variant_title ?? '',
                        'qty' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'line_total' => (float) $item->line_total,
                        'price_after_coupon' => round($priceAfterCoupon, 2),
                        'tax_rate' => $taxRate,
                        'price_without_tax' => round($priceWithoutTax, 2),
                        'tax_amount' => round($taxAmount, 2),
                    ];
                })->toArray(),
                'status_history' => $order->statusHistory->map(function ($history) {
                    return [
                        'old_status' => $history->old_status,
                        'new_status' => $history->new_status,
                        'note' => $history->note,
                        'changed_by' => $history->changed_by_name,
                        'created_at' => $history->created_at->format('d M Y, H:i'),
                    ];
                })->toArray(),
            ];

            return $this->successResponse($transformedOrder, 'Sipariş detayı getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sipariş detayı alınamadı');
        }
    }

    /**
     * Cancel order if cancellable
     */
    public function cancelOrder(int $userId, string $orderNumber, string $reason = 'Kullanıcı tarafından iptal edildi')
    {
        try {
            $order = Order::where('user_id', $userId)
                ->where('order_number', $orderNumber)
                ->first();

            if (!$order) {
                return $this->errorResponse('Sipariş bulunamadı', 404);
            }

            if (!$order->isCancellable()) {
                return $this->errorResponse('Bu sipariş iptal edilemez', 400);
            }

            $order->updateStatus(
                Order::STATUS_CANCELLED,
                $reason,
                'user',
                $userId
            );

            return $this->successResponse($order->fresh(), 'Sipariş iptal edildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sipariş iptal edilemedi');
        }
    }
}
