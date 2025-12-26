<?php

namespace App\Services\Order;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Interfaces\Services\Order\OrderCreationServiceInterface;
use App\Services\BaseService;
use App\Models\Cart;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;
use App\Repositories\CartRepository;
use App\Repositories\OrderRepository;
use App\Repositories\OrderItemRepository;
use App\Repositories\OrderStatusHistoryRepository;
use App\Repositories\VendorCouponRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * OrderCreationService
 * 
 * Handles order creation from cart.
 */
class OrderCreationService extends BaseService implements OrderCreationServiceInterface
{
    public function __construct(
        protected OrderValidationService $validationService,
        protected OrderRepository $orderRepository,
        protected OrderItemRepository $orderItemRepository,
        protected OrderStatusHistoryRepository $statusHistoryRepository,
        protected VendorCouponRepository $vendorCouponRepository,
        protected CartRepository $cartRepository
    ) {}

    /**
     * Create order from cart
     */
    public function createOrderFromCart(User $user, Cart $cart, UserAddress $shippingAddress, ?UserAddress $billingAddress = null)
    {
        $validation = $this->validationService->validateCart($cart);
        if (!$validation->isSuccess()) {
            return $validation;
        }

        try {
            return DB::transaction(function () use ($user, $cart, $shippingAddress, $billingAddress) {
                // DUPLICATE PREVENTION: Aynı kullanıcının son 5 dakikada pending siparişi varsa onu kullan
                $existingOrder = $this->orderRepository->findRecentPendingForUser($user->id);

                if ($existingOrder) {
                    Log::warning('Duplicate order attempt prevented', [
                        'existing_order_id' => $existingOrder->id,
                        'existing_order_number' => $existingOrder->order_number,
                        'user_id' => $user->id,
                    ]);

                    // Mevcut siparişin basket items'ını tekrar hesapla
                    $basketItems = $existingOrder->items->map(function ($item) {
                        return [
                            'id' => (string) $item->id,
                            'name' => $item->product_name,
                            'category1' => $item->product->category->name ?? 'Genel',
                            'itemType' => 'PHYSICAL',
                            'price' => (string) $item->unit_price,
                        ];
                    })->toArray();

                    return $this->successResponse([
                        'order' => $existingOrder,
                        'basket_items' => $basketItems,
                    ], 'Mevcut sipariş kullanılıyor');
                }

                $cart = $this->cartRepository->loadForValidation($cart);
                $totals = $cart->totals;

                $order = $this->createOrderRecord($user, $cart, $shippingAddress, $billingAddress, $totals);
                $basketItems = $this->createOrderItems($order, $cart);
                $this->createInitialStatusHistory($order);

                Log::info('Order created from cart', [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_id' => $user->id,
                    'total' => $order->total,
                    'item_count' => count($basketItems),
                ]);

                return $this->successResponse([
                    'order' => $order,
                    'basket_items' => $basketItems,
                ], 'Sipariş oluşturuldu');
            });
        } catch (\Exception $e) {
            Log::error('Order creation failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return $this->errorResponse('Sipariş oluşturulamadı: ' . $e->getMessage());
        }
    }

    /**
     * Create order record
     */
    protected function createOrderRecord(User $user, Cart $cart, UserAddress $shippingAddress, ?UserAddress $billingAddress, array $totals): Order
    {
        $orderData = [
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING->value,
            'payment_status' => PaymentStatus::PENDING->value,
            'shipping_address' => $this->snapshotAddress($shippingAddress),
            'billing_address' => $billingAddress ? $this->snapshotAddress($billingAddress) : null,
            'subtotal' => $totals['subtotal'],
            'shipping_total' => $totals['shipping'],
            'discount_total' => $totals['discount'] ?? 0,
            'campaign_discount' => $totals['campaign_discount'] ?? 0,
            'coupon_discount' => $totals['coupon_discount'] ?? 0,
            'total' => $totals['total'],
            'currency' => 'TRY',
            'coupon_code' => $cart->coupon_code,
            'iyzico_conversation_id' => $this->generateConversationId(),
        ];

        $order = $this->orderRepository->create($orderData);

        if ($cart->coupon_code) {
            $coupon = $this->vendorCouponRepository->findActiveByCode($cart->coupon_code);
            if ($coupon) {
                $this->orderRepository->update($order->id, ['coupon_id' => $coupon->id]);
            }
        }

        return $order;
    }

    /**
     * Create order items from cart items
     */
    protected function createOrderItems(Order $order, Cart $cart): array
    {
        $basketItems = [];

        foreach ($cart->items as $item) {
            $vendor = $item->product->vendor;
            $commissionRate = $vendor->commission_rate ?? config('app.default_commission_rate', 10);

            $commissionAmount = ($item->line_total * $commissionRate) / 100;
            $submerchantPrice = $item->line_total - $commissionAmount;

            $orderItem = $this->orderItemRepository->create([
                'order_id' => $order->id,
                'vendor_id' => $vendor->id,
                'product_id' => $item->product_id,
                'variant_id' => $item->variant_id,
                'product_name' => $item->product->name,
                'variant_title' => $item->variant?->title,
                'sku' => $item->variant?->sku ?? $item->product->sku ?? null,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'line_total' => $item->line_total,
                'submerchant_key' => $vendor->iyzico_submerchant_key,
                'submerchant_price' => $submerchantPrice,
                'commission_rate' => $commissionRate,
                'commission_amount' => $commissionAmount,
                'iyzico_item_id' => 'ITEM_' . $order->id . '_' . $item->id,
                'status' => 'pending',
            ]);

            $basketItems[] = [
                'id' => $orderItem->iyzico_item_id,
                'name' => $orderItem->product_name . ($orderItem->variant_title ? ' - ' . $orderItem->variant_title : ''),
                'category' => $item->product->category?->name ?? 'Genel',
                'price' => $orderItem->line_total,
                'submerchant_key' => $orderItem->submerchant_key,
                'submerchant_price' => $orderItem->submerchant_price,
            ];
        }

        return $basketItems;
    }

    /**
     * Create initial status history
     */
    protected function createInitialStatusHistory(Order $order): void
    {
        $this->statusHistoryRepository->create([
            'order_id' => $order->id,
            'old_status' => null,
            'new_status' => OrderStatus::PENDING->value,
            'note' => 'Sipariş oluşturuldu',
            'changed_by_type' => 'system',
            'changed_by_id' => null,
        ]);
    }

    /**
     * Snapshot address to array
     */
    protected function snapshotAddress(UserAddress $address): array
    {
        return [
            'id' => $address->id,
            'label' => $address->label,
            'full_name' => $address->full_name,
            'phone' => $address->phone,
            'country' => $address->country,
            'city' => $address->city,
            'district' => $address->district,
            'neighborhood' => $address->neighborhood,
            'address_line' => $address->address_line,
            'postal_code' => $address->postal_code,
        ];
    }

    /**
     * Generate unique conversation ID for Iyzico
     */
    protected function generateConversationId(): string
    {
        return config('iyzico.conversation_prefix', 'ticaret_') . uniqid() . '_' . time();
    }
}
