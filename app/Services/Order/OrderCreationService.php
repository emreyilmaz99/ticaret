<?php

namespace App\Services\Order;

use App\Services\BaseService;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\VendorCoupon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * OrderCreationService
 * 
 * Handles order creation from cart.
 */
class OrderCreationService extends BaseService
{
    protected OrderValidationService $validationService;

    public function __construct(OrderValidationService $validationService)
    {
        $this->validationService = $validationService;
    }

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
                $cart->load(['items.product.vendor', 'items.variant']);
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
        $order = Order::create([
            'user_id' => $user->id,
            'status' => Order::STATUS_PENDING,
            'payment_status' => Order::PAYMENT_PENDING,
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
        ]);

        if ($cart->coupon_code) {
            $coupon = VendorCoupon::where('code', $cart->coupon_code)->first();
            if ($coupon) {
                $order->coupon_id = $coupon->id;
                $order->save();
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

            $orderItem = OrderItem::create([
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
                'status' => OrderItem::STATUS_PENDING,
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
        $order->statusHistory()->create([
            'old_status' => null,
            'new_status' => Order::STATUS_PENDING,
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
