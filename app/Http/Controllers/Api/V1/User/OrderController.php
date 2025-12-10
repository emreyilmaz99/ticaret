<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Kullanıcının siparişlerini listele
     * GET /api/user/orders
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product.photos'])
            ->withCount('items')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders->items(),
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
            ],
        ]);
    }

    /**
     * Sipariş detayını göster
     * GET /api/user/orders/{orderNumber}
     */
    public function show(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('user_id', $user->id)
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
            return response()->json([
                'success' => false,
                'message' => 'Sipariş bulunamadı',
            ], 404);
        }

        // Transform data for frontend
        $totalBeforeDiscount = $order->items->sum('line_total');
        $couponDiscount = (float) ($order->coupon_discount ?? 0);
        
        // Calculate total tax from items
        $totalTax = $order->items->sum(function ($item) use ($totalBeforeDiscount, $couponDiscount) {
            $taxRate = $item->product?->taxClass?->rate ?? 0;
            $originalPrice = (float) $item->line_total;
            
            // Calculate item's share of coupon discount
            $itemCouponDiscount = 0;
            if ($totalBeforeDiscount > 0 && $couponDiscount > 0) {
                $itemCouponDiscount = ($originalPrice / $totalBeforeDiscount) * $couponDiscount;
            }
            $priceAfterCoupon = $originalPrice - $itemCouponDiscount;
            
            // Calculate tax on price after coupon
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
                
                // Calculate item's share of coupon discount
                $originalPrice = (float) $item->line_total;
                $itemCouponDiscount = 0;
                if ($totalBeforeDiscount > 0 && $couponDiscount > 0) {
                    $itemCouponDiscount = ($originalPrice / $totalBeforeDiscount) * $couponDiscount;
                }
                $priceAfterCoupon = $originalPrice - $itemCouponDiscount;
                
                // Get tax rate from product
                $taxRate = (float) ($item->product?->taxClass?->rate ?? 0);
                
                // Calculate price without tax and tax amount
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

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $transformedOrder,
            ],
        ]);
    }

    /**
     * Siparişi iptal et
     * POST /api/user/orders/{orderNumber}/cancel
     */
    public function cancel(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('user_id', $user->id)
            ->where('order_number', $orderNumber)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Sipariş bulunamadı',
            ], 404);
        }

        if (!$order->isCancellable()) {
            return response()->json([
                'success' => false,
                'message' => 'Bu sipariş iptal edilemez',
            ], 400);
        }

        $order->updateStatus(
            Order::STATUS_CANCELLED,
            'Kullanıcı tarafından iptal edildi',
            'user',
            $user->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Sipariş iptal edildi',
            'data' => [
                'order' => $order->fresh(),
            ],
        ]);
    }
}
