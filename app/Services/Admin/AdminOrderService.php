<?php

namespace App\Services\Admin;

use App\Services\BaseService;
use App\Services\OrderFinancialCalculator;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderNote;
use App\Traits\FormatsOrderData;
use App\Traits\FormatsProductData;
use Illuminate\Support\Facades\DB;

class AdminOrderService extends BaseService
{
    use FormatsOrderData, FormatsProductData;
    
    protected OrderFinancialCalculator $financialCalculator;
    
    public function __construct(OrderFinancialCalculator $financialCalculator)
    {
        $this->financialCalculator = $financialCalculator;
    }
    
    /**
     * Override payment method label to include card types
     */
    protected function getPaymentMethodLabel(Order $order): string
    {
        if (!empty($order->card_type)) {
            $cardTypes = [
                'CREDIT_CARD' => 'Kredi Kartı',
                'DEBIT_CARD' => 'Banka Kartı',
            ];
            return $cardTypes[$order->card_type] ?? 'Kart';
        }
        
        if (!empty($order->card_association)) {
            return 'Kredi Kartı';
        }

        return 'Havale/EFT';
    }
    /**
     * Get all orders with filtering and pagination
     */
    public function getOrders(array $filters = [])
    {
        try {
            $query = Order::with([
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
                // Calculate totals and coupon
                $totalBeforeDiscount = $order->items->sum('line_total');
                $couponDiscount = (float) ($order->coupon_discount ?? 0);
                
                // Calculate total commission from all items (after coupon)
                $totalCommission = $order->items->sum(function ($item) use ($totalBeforeDiscount, $couponDiscount) {
                    $vendor = $item->product?->vendor;
                    $commissionPlan = $vendor?->commissionPlan;
                    
                    if (!$commissionPlan) {
                        return 0;
                    }

                    // Apply proportional coupon discount
                    $originalPrice = (float) $item->line_total;
                    $itemCouponDiscount = 0;
                    if ($totalBeforeDiscount > 0 && $couponDiscount > 0) {
                        $itemCouponDiscount = ($originalPrice / $totalBeforeDiscount) * $couponDiscount;
                    }
                    $priceAfterCoupon = $originalPrice - $itemCouponDiscount;
                    
                    $priceWithoutTax = $priceAfterCoupon / (1 + ($item->product->taxClass->rate ?? 0) / 100);
                    return $priceWithoutTax * ($commissionPlan->rate / 100);
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
                        'avatar' => $this->getCustomerAvatar($order->user->name ?? 'User')
                    ],
                    'vendors' => $vendors,
                    'shippingAddress' => $this->formatAddress($order->shipping_address),
                    'date' => $order->created_at->format('d M Y, H:i'),
                    'amount' => (float) $order->total,
                    'subtotal' => (float) ($order->subtotal ?: $totalBeforeDiscount),
                    'coupon_discount' => $couponDiscount,
                    'coupon_code' => $order->coupon_code ?? null,
                    'coupon' => $order->coupon ? [
                        'code' => $order->coupon->code,
                        'discount_amount' => $order->coupon->discount_amount,
                        'min_order_amount' => $order->coupon->min_order_amount,
                    ] : null,
                    'commission' => round($totalCommission, 2),
                    'paymentMethod' => $this->getPaymentMethodLabel($order),
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'items' => $order->items->count(),
                    'status_history' => $order->statusHistory->map(function ($history) {
                        return [
                            'old_status' => $history->old_status,
                            'new_status' => $history->new_status,
                            'note' => $history->note,
                            'changed_by_type' => $history->changed_by_type,
                            'changed_by_name' => $history->changed_by_name,
                            'created_at' => $history->created_at->format('d M Y, H:i'),
                        ];
                    })->toArray(),
                    'products' => $order->items->map(function ($item) use ($totalBeforeDiscount, $couponDiscount) {
                        $mainPhoto = $item->product?->photos?->sortBy('sort_order')->first();
                        $imageUrl = $this->formatImageUrl($mainPhoto) ?? 'https://via.placeholder.com/200';

                        return [
                            'id' => $item->product_id,
                            'name' => $item->product_name,
                            'slug' => $item->product?->slug ?? '',
                            'variant' => $item->variant_title ?? '',
                            'price' => (float) $item->unit_price,
                            'qty' => $item->quantity,
                            'image' => $imageUrl,
                            'vendor' => $item->product?->vendor?->company_name ?? 'Bilinmeyen',
                            'financials' => $this->financialCalculator->calculate($item, $totalBeforeDiscount, $couponDiscount)
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
     * Cancel order (Admin only)
     */
    public function cancelOrder(int $orderId, string $reason = null, int $adminId = null)
    {
        try {
            $order = Order::findOrFail($orderId);

            if (!in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_CONFIRMED, Order::STATUS_PROCESSING])) {
                return $this->errorResponse('Bu sipariş iptal edilemez', 400);
            }

            DB::beginTransaction();

            // Order durumunu güncelle
            $noteText = $reason ? "Admin İptali: {$reason}" : 'Admin tarafından iptal edildi';
            
            $order->updateStatus(
                Order::STATUS_CANCELLED,
                $noteText,
                'admin',
                $adminId
            );

            // Tüm order item'ları iptal et
            $order->items()->update(['status' => OrderItem::STATUS_CANCELLED]);

            DB::commit();

            return $this->successResponse(null, 'Sipariş iptal edildi');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e, 'Sipariş iptal edilemedi');
        }
    }

    /**
     * Add note to order
     */
    public function addNote(int $orderId, string $note, int $adminId, bool $visibleToVendor = true, bool $visibleToCustomer = false)
    {
        $order = Order::findOrFail($orderId);

        $orderNote = OrderNote::create([
            'order_id' => $orderId,
            'admin_id' => $adminId,
            'note' => $note,
            'is_visible_to_vendor' => $visibleToVendor,
            'is_visible_to_customer' => $visibleToCustomer,
        ]);

        return [
            'id' => $orderNote->id,
            'note' => $orderNote->note,
            'admin_name' => $orderNote->admin->name ?? 'Admin',
            'is_visible_to_vendor' => $orderNote->is_visible_to_vendor,
            'is_visible_to_customer' => $orderNote->is_visible_to_customer,
            'created_at' => $orderNote->created_at->format('d.m.Y H:i'),
        ];
    }

    /**
     * Get order notes
     */
    public function getNotes(int $orderId)
    {
        return OrderNote::where('order_id', $orderId)
            ->with('admin:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($note) {
                return [
                    'id' => $note->id,
                    'note' => $note->note,
                    'admin_name' => $note->admin->name ?? 'Admin',
                    'is_visible_to_vendor' => $note->is_visible_to_vendor,
                    'is_visible_to_customer' => $note->is_visible_to_customer,
                    'created_at' => $note->created_at->format('d.m.Y H:i'),
                ];
            })->toArray();
    }

    /**
     * Get user's other orders
     */
    public function getUserOrders(int $userId, int $excludeOrderId = null)
    {
        $query = Order::where('user_id', $userId)
            ->select('id', 'order_number', 'status', 'payment_status', 'total', 'created_at')
            ->orderBy('created_at', 'desc');

        if ($excludeOrderId) {
            $query->where('id', '!=', $excludeOrderId);
        }

        return $query->limit(10)->get()->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total' => (float) $order->total,
                'created_at' => $order->created_at->format('d.m.Y H:i'),
            ];
        })->toArray();
    }
}


