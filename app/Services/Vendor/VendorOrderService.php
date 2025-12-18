<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorOrderServiceInterface;
use App\Services\BaseService;
use App\Services\OrderFinancialCalculator;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Vendor;
use App\Traits\FormatsOrderData;
use App\Traits\FormatsProductData;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class VendorOrderService extends BaseService implements VendorOrderServiceInterface
{
    use FormatsOrderData, FormatsProductData;
    
    protected OrderFinancialCalculator $financialCalculator;
    protected const STATS_CACHE_TTL = 900; // 15 minutes
    
    public function __construct(OrderFinancialCalculator $financialCalculator)
    {
        $this->financialCalculator = $financialCalculator;
    }
    /**
     * Get vendor's orders with filtering and pagination
     */
    public function getVendorOrders(int $vendorId, array $filters = [])
    {
        try {
            $query = OrderItem::where('vendor_id', $vendorId)
                ->with([
                    'order' => function ($q) {
                        $q->with(['user:id,name,email', 'coupon:id,code,discount_amount,min_order_amount']);
                    },
                    'product:id,name,slug,tax_class_id,vendor_id',
                    'product.photos:id,product_id,url,sort_order',
                    'product.taxClass:id,name,rate',
                    'product.vendor:id,company_name,email,phone,tax_id,commission_plan_id',
                    'product.vendor.addresses',
                    'product.vendor.commissionPlan:id,name,rate',
                    'variant:id,title,sku'
                ])
                ->orderBy('created_at', 'desc');

            // Filters
            if (!empty($filters['search'])) {
                $search = $filters['search'];
                $query->whereHas('order', function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            }

            if (!empty($filters['status']) && $filters['status'] !== 'all') {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['min_amount'])) {
                $query->where('line_total', '>=', $filters['min_amount']);
            }

            if (!empty($filters['max_amount'])) {
                $query->where('line_total', '<=', $filters['max_amount']);
            }

            // Group by order_id to avoid duplicates
            $orderItems = $query->get()->groupBy('order_id');

            // Transform to order-centric structure
            $orders = $orderItems->map(function ($items, $orderId) use ($vendorId) {
                $firstItem = $items->first();
                $order = $firstItem->order;
                $vendor = $firstItem->product?->vendor;
                
                // Calculate coupon discount per item
                $totalBeforeDiscount = $items->sum('line_total');
                $couponDiscount = (float) ($order->coupon_discount ?? 0);

                return [
                    'id' => $order->order_number,
                    'order_id' => $order->id,
                    'customer' => [
                        'name' => $order->user->name ?? 'Misafir',
                        'email' => $order->user->email ?? '',
                        'phone' => $order->shipping_address['phone'] ?? '',
                        'avatar' => $this->getCustomerAvatar($order->user->name ?? 'User')
                    ],
                    'vendor' => [
                        'name' => $vendor->company_name ?? 'Satıcı',
                        'email' => $vendor->email ?? '',
                        'phone' => $vendor->phone ?? '',
                        'tax_id' => $vendor->tax_id ?? '',
                        'address' => $vendor->addresses->first()?->full_address ?? ''
                    ],
                    'shippingAddress' => $this->formatAddress($order->shipping_address),
                    'date' => $order->created_at->format('d M Y, H:i'),
                    'amount' => (float) (($order->total_amount ?: $totalBeforeDiscount) - $couponDiscount),
                    'subtotal' => (float) ($order->subtotal ?: $totalBeforeDiscount),
                    'coupon_discount' => $couponDiscount,
                    'coupon_code' => $order->coupon_code ?? null,
                    'coupon' => $order->coupon ? [
                        'code' => $order->coupon->code,
                        'discount_amount' => $order->coupon->discount_amount,
                        'min_order_amount' => $order->coupon->min_order_amount,
                    ] : null,
                    'paymentMethod' => $this->getPaymentMethodLabel($order),
                    'status' => $firstItem->status,
                    'items' => $items->count(),
                    'products' => $items->map(function ($item) use ($totalBeforeDiscount, $couponDiscount) {
                        $mainPhoto = $item->product?->photos?->sortBy('sort_order')->first();
                        $imageUrl = $this->formatImageUrl($mainPhoto) ?? 'https://via.placeholder.com/200';

                        return [
                            'id' => $item->product_id,
                            'name' => $item->product_name,
                            'slug' => $item->product->slug ?? '',
                            'variant' => $item->variant_title ?? '',
                            'price' => (float) $item->unit_price,
                            'qty' => $item->quantity,
                            'image' => $imageUrl,
                            'financials' => $this->financialCalculator->calculate($item, $totalBeforeDiscount, $couponDiscount)
                        ];
                    })->values()->toArray()
                ];
            })->values()->toArray();

            return $this->successResponse([
                'orders' => $orders,
                'total' => count($orders)
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Siparişler getirilemedi');
        }
    }

    /**
     * Get order statistics for vendor (cached)
     */
    public function getVendorOrderStats(int $vendorId)
    {
        try {
            $cacheKey = "vendor:{$vendorId}:order_stats";
            
            return Cache::remember($cacheKey, self::STATS_CACHE_TTL, function () use ($vendorId) {
                return $this->calculateVendorOrderStats($vendorId);
            });
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler getirilemedi');
        }
    }
    
    /**
     * Calculate vendor order statistics
     */
    protected function calculateVendorOrderStats(int $vendorId)
    {
        $totalOrders = OrderItem::where('vendor_id', $vendorId)
            ->distinct('order_id')
            ->count('order_id');

            $pendingOrders = OrderItem::where('vendor_id', $vendorId)
                ->where('status', OrderItem::STATUS_PENDING)
                ->distinct('order_id')
                ->count('order_id');

            $processingOrders = OrderItem::where('vendor_id', $vendorId)
                ->where('status', OrderItem::STATUS_PROCESSING)
                ->distinct('order_id')
                ->count('order_id');

            $todayEarnings = OrderItem::where('vendor_id', $vendorId)
                ->whereDate('created_at', today())
                ->where('status', '!=', OrderItem::STATUS_CANCELLED)
                ->sum('line_total');

            // Calculate changes (last 30 days vs previous 30 days)
            $last30DaysOrders = OrderItem::where('vendor_id', $vendorId)
                ->whereBetween('created_at', [now()->subDays(30), now()])
                ->distinct('order_id')
                ->count('order_id');

            $previous30DaysOrders = OrderItem::where('vendor_id', $vendorId)
                ->whereBetween('created_at', [now()->subDays(60), now()->subDays(30)])
                ->distinct('order_id')
                ->count('order_id');

            $orderChangePercent = $previous30DaysOrders > 0
                ? round((($last30DaysOrders - $previous30DaysOrders) / $previous30DaysOrders) * 100)
                : 0;

            return $this->successResponse([
                'stats' => [
                    [
                        'label' => 'Toplam Sipariş',
                        'value' => number_format($totalOrders),
                        'change' => ($orderChangePercent >= 0 ? '+' : '') . $orderChangePercent . '%',
                        'icon' => 'FaShoppingBag',
                        'color' => 'blue'
                    ],
                    [
                        'label' => 'Bekleyen Sipariş',
                        'value' => number_format($pendingOrders),
                        'change' => '',
                        'icon' => 'FaClock',
                        'color' => 'amber'
                    ],
                    [
                        'label' => 'Hazırlanan',
                        'value' => number_format($processingOrders),
                        'change' => '',
                        'icon' => 'FaBoxOpen',
                        'color' => 'purple'
                    ],
                    [
                        'label' => 'Bugünkü Kazanç',
                        'value' => '₺' . number_format($todayEarnings, 2, ',', '.'),
                        'change' => '',
                        'icon' => 'FaWallet',
                        'color' => 'green'
                    ],
                ]
            ]);

    }

    /**
     * Update all order items status for an order (by vendor)
     */
    public function updateOrderStatus(int $vendorId, int $orderId, string $newStatus)
    {
        try {
            $orderItems = OrderItem::where('vendor_id', $vendorId)
                ->where('order_id', $orderId)
                ->get();

            if ($orderItems->isEmpty()) {
                return $this->errorResponse('Bu siparişe ait ürün bulunamadı', 404);
            }

            DB::beginTransaction();

            foreach ($orderItems as $item) {
                if ($this->isValidStatusTransition($item->status, $newStatus)) {
                    $item->updateStatus($newStatus);
                }
            }

            $this->syncOrderStatus($orderId);
            
            // Clear stats cache
            Cache::forget("vendor:{$vendorId}:order_stats");

            DB::commit();

            return $this->successResponse(null, 'Sipariş durumu güncellendi');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e, 'Durum güncellenemedi');
        }
    }

    /**
     * Cancel order items
     */
    public function cancelOrder(int $vendorId, int $orderId)
    {
        return $this->updateOrderStatus($vendorId, $orderId, OrderItem::STATUS_CANCELLED);
    }

    /**
     * Sync main order status based on all items
     */
    private function syncOrderStatus(int $orderId)
    {
        $order = Order::find($orderId);
        if (!$order) return;

        $allItems = $order->items;
        
        // If all cancelled, mark order as cancelled
        if ($allItems->every(fn($item) => $item->status === OrderItem::STATUS_CANCELLED)) {
            $order->updateStatus(Order::STATUS_CANCELLED);
            return;
        }

        // If all delivered, mark order as delivered
        if ($allItems->every(fn($item) => $item->status === OrderItem::STATUS_DELIVERED)) {
            $order->updateStatus(Order::STATUS_DELIVERED);
            return;
        }

        // If any shipped, mark order as shipped
        if ($allItems->contains(fn($item) => $item->status === OrderItem::STATUS_SHIPPED)) {
            $order->updateStatus(Order::STATUS_SHIPPED);
            return;
        }

        // If any processing, mark order as processing
        if ($allItems->contains(fn($item) => $item->status === OrderItem::STATUS_PROCESSING)) {
            $order->updateStatus(Order::STATUS_PROCESSING);
        }
    }

    /**
     * Validate status transition
     */
    private function isValidStatusTransition(string $currentStatus, string $newStatus): bool
    {
        $allowedTransitions = [
            OrderItem::STATUS_PENDING => [OrderItem::STATUS_PROCESSING, OrderItem::STATUS_CANCELLED],
            OrderItem::STATUS_PROCESSING => [OrderItem::STATUS_SHIPPED, OrderItem::STATUS_CANCELLED],
            OrderItem::STATUS_SHIPPED => [OrderItem::STATUS_DELIVERED],
            OrderItem::STATUS_DELIVERED => [OrderItem::STATUS_REFUNDED],
            OrderItem::STATUS_CANCELLED => [],
            OrderItem::STATUS_REFUNDED => [],
        ];

        return in_array($newStatus, $allowedTransitions[$currentStatus] ?? []);
    }

}
