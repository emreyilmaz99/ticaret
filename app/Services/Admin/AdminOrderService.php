<?php

namespace App\Services\Admin;

use App\Services\BaseService;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class AdminOrderService extends BaseService
{
    /**
     * Get all orders with filtering and pagination
     */
    public function getOrders(array $filters = [])
    {
        try {
            $query = Order::with([
                'user:id,name,email',
                'items.product:id,name,slug,vendor_id,tax_class_id',
                'items.product.photos:id,product_id,url,sort_order',
                'items.product.vendor:id,company_name,email,phone,tax_id,commission_plan_id',
                'items.product.vendor.commissionPlan:id,rate',
                'items.product.taxClass:id,name,rate',
                'items.variant:id,title,sku'
            ])->orderBy('created_at', 'desc');

            // Filters
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

            if (!empty($filters['status']) && $filters['status'] !== 'all') {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['payment_status']) && $filters['payment_status'] !== 'all') {
                $query->where('payment_status', $filters['payment_status']);
            }

            if (!empty($filters['min_amount'])) {
                $query->where('total', '>=', $filters['min_amount']);
            }

            if (!empty($filters['max_amount'])) {
                $query->where('total', '<=', $filters['max_amount']);
            }

            $orders = $query->get();

            // Transform to admin-centric structure
            $transformedOrders = $orders->map(function ($order) {
                // Calculate total commission from all items
                $totalCommission = $order->items->sum(function ($item) {
                    $vendor = $item->product?->vendor;
                    $commissionPlan = $vendor?->commissionPlan;
                    
                    if (!$commissionPlan) {
                        return 0;
                    }

                    $priceWithoutTax = $item->unit_price / (1 + ($item->product->taxClass->rate ?? 0) / 100);
                    return $priceWithoutTax * ($commissionPlan->rate / 100) * $item->quantity;
                });

                // Get unique vendors with contact info
                $vendors = $order->items->map(function ($item) {
                    $vendor = $item->product?->vendor;
                    if (!$vendor) {
                        return null;
                    }
                    
                    return [
                        'id' => $vendor->id,
                        'name' => $vendor->company_name ?? 'Bilinmeyen Satıcı',
                        'email' => $vendor->email ?? '',
                        'phone' => $vendor->phone ?? '',
                        'tax_id' => $vendor->tax_id ?? ''
                    ];
                })->filter()->unique('id')->values();

                return [
                    'id' => $order->order_number,
                    'order_id' => $order->id,
                    'customer' => [
                        'id' => $order->user->id ?? null,
                        'name' => $order->user->name ?? 'Misafir',
                        'email' => $order->user->email ?? '',
                        'phone' => $order->shipping_address['phone'] ?? '',
                        'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($order->user->name ?? 'User') . "&background=random"
                    ],
                    'vendors' => $vendors,
                    'shippingAddress' => $this->formatAddress($order->shipping_address),
                    'date' => $order->created_at->format('d M Y, H:i'),
                    'amount' => (float) $order->total,
                    'commission' => round($totalCommission, 2),
                    'paymentMethod' => $this->getPaymentMethodLabel($order),
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'items' => $order->items->count(),
                    'products' => $order->items->map(function ($item) {
                        $imageUrl = 'https://via.placeholder.com/200';
                        if ($item->product && $item->product->photos && $item->product->photos->isNotEmpty()) {
                            $imageUrl = $item->product->photos->first()->url;
                        }

                        return [
                            'id' => $item->product_id,
                            'name' => $item->product_name,
                            'slug' => $item->product?->slug ?? '',
                            'variant' => $item->variant_title ?? '',
                            'price' => (float) $item->unit_price,
                            'qty' => $item->quantity,
                            'image' => $imageUrl,
                            'vendor' => $item->product?->vendor?->company_name ?? 'Bilinmeyen',
                            'financials' => $this->calculateFinancials($item)
                        ];
                    })->values()->toArray()
                ];
            })->values();

            return $this->successResponse([
                'orders' => $transformedOrders->toArray(),
                'total' => $transformedOrders->count()
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Siparişler getirilemedi');
        }
    }

    /**
     * Get admin order statistics
     */
    public function getOrderStats()
    {
        try {
            // Total orders
            $totalOrders = Order::count();

            // Pending orders
            $pendingOrders = Order::where('status', Order::STATUS_PENDING)->count();

            // Total revenue (platform commission)
            $totalRevenue = DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('vendors', 'products.vendor_id', '=', 'vendors.id')
                ->join('commission_plans', 'vendors.commission_plan_id', '=', 'commission_plans.id')
                ->join('tax_classes', 'products.tax_class_id', '=', 'tax_classes.id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.payment_status', Order::PAYMENT_PAID)
                ->selectRaw('SUM(
                    (order_items.unit_price / (1 + tax_classes.rate / 100)) * 
                    (commission_plans.rate / 100) * 
                    order_items.quantity
                ) as total_commission')
                ->value('total_commission') ?? 0;

            // Active vendors (vendors with orders)
            $activeVendors = DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->distinct('products.vendor_id')
                ->count('products.vendor_id');

            return $this->successResponse([
                'stats' => [
                    [
                        'label' => 'Toplam Sipariş',
                        'value' => number_format($totalOrders),
                        'icon' => 'FaShoppingBag',
                        'color' => 'blue'
                    ],
                    [
                        'label' => 'Bekleyen Sipariş',
                        'value' => number_format($pendingOrders),
                        'icon' => 'FaClock',
                        'color' => 'amber'
                    ],
                    [
                        'label' => 'Platform Geliri',
                        'value' => '₺' . number_format($totalRevenue, 2, ',', '.'),
                        'icon' => 'FaWallet',
                        'color' => 'green'
                    ],
                    [
                        'label' => 'Aktif Satıcı',
                        'value' => number_format($activeVendors),
                        'icon' => 'FaStore',
                        'color' => 'purple'
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler getirilemedi');
        }
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(int $orderId, string $newStatus)
    {
        try {
            $order = Order::findOrFail($orderId);

            $order->updateStatus($newStatus);

            return $this->successResponse(null, 'Sipariş durumu güncellendi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Durum güncellenemedi');
        }
    }

    /**
     * Cancel order
     */
    public function cancelOrder(int $orderId)
    {
        try {
            $order = Order::findOrFail($orderId);

            if (!in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_CONFIRMED])) {
                return $this->errorResponse('Bu sipariş iptal edilemez', 400);
            }

            $order->updateStatus(Order::STATUS_CANCELLED);

            // Also cancel all order items
            $order->items()->update(['status' => OrderItem::STATUS_CANCELLED]);

            return $this->successResponse(null, 'Sipariş iptal edildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sipariş iptal edilemedi');
        }
    }

    /**
     * Format address for display
     */
    protected function formatAddress(?array $address): string
    {
        if (!$address) {
            return 'Adres bilgisi yok';
        }

        $parts = array_filter([
            $address['address'] ?? null,
            $address['district'] ?? null,
            $address['city'] ?? null,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Get payment method label
     */
    protected function getPaymentMethodLabel(Order $order): string
    {
        $cardTypes = [
            'CREDIT_CARD' => 'Kredi Kartı',
            'DEBIT_CARD' => 'Banka Kartı',
        ];

        return $cardTypes[$order->card_type] ?? 'Kart';
    }

    /**
     * Calculate financial breakdown for an order item
     * 
     * Formula:
     * - Customer Payment (with tax) = order_item.line_total
     * - Price without tax = line_total / (1 + tax_rate/100)
     * - Tax amount = line_total - price_without_tax
     * - Commission = price_without_tax * (commission_rate/100)
     * - Vendor earning = price_without_tax - commission
     */
    private function calculateFinancials(\App\Models\OrderItem $orderItem): array
    {
        $price = (float) $orderItem->line_total; // Total price including tax
        $taxRate = (float) ($orderItem->product?->taxClass?->rate ?? 0);
        $commissionRate = (float) ($orderItem->product?->vendor?->commissionPlan?->rate ?? 0);
        
        // Calculate price without tax
        $priceWithoutTax = $price / (1 + ($taxRate / 100));
        
        // Calculate tax amount
        $taxAmount = $price - $priceWithoutTax;
        
        // Calculate commission (based on price without tax)
        $commissionAmount = $priceWithoutTax * ($commissionRate / 100);
        
        // Vendor earning
        $vendorEarning = $priceWithoutTax - $commissionAmount;
        
        return [
            'price_with_tax' => round($price, 2),
            'price_without_tax' => round($priceWithoutTax, 2),
            'tax_rate' => $taxRate,
            'tax_amount' => round($taxAmount, 2),
            'commission_rate' => $commissionRate,
            'commission_amount' => round($commissionAmount, 2),
            'vendor_earning' => round($vendorEarning, 2),
        ];
    }
}
