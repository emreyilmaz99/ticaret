<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\VendorCampaign;
use App\Models\VendorShippingSetting;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'coupon_code',
        'discount_amount',
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Sepet toplamlarını hesapla (satıcı bazlı kargo ve kampanya indirimleri ile)
     */
    public function getTotalsAttribute(): array
    {
        // Sepet boşsa
        if ($this->items->isEmpty()) {
            return [
                'subtotal' => 0,
                'discount' => 0,
                'campaign_discount' => 0,
                'coupon_discount' => 0,
                'shipping' => 0,
                'total' => 0,
                'item_count' => 0,
                'shipping_breakdown' => [],
                'campaign_breakdown' => [],
            ];
        }

        // Genel alt toplam
        $subtotal = $this->items->sum(function ($item) {
            return $item->unit_price * $item->quantity;
        });

        // Kampanya indirimlerini hesapla
        $campaignResult = $this->calculateCampaignDiscounts();
        $campaignDiscount = $campaignResult['total_discount'];
        $campaignBreakdown = $campaignResult['breakdown'];

        // Satıcıya göre grupla ve kargo hesapla
        $shippingBreakdown = $this->calculateShippingByVendor();
        
        // Toplam kargo ücreti
        $totalShipping = collect($shippingBreakdown)->sum('shipping_cost');
        
        // Kupon indirimi
        $couponDiscount = $this->discount_amount ?? 0;
        
        // Toplam indirim
        $totalDiscount = $campaignDiscount + $couponDiscount;

        return [
            'subtotal' => round($subtotal, 2),
            'discount' => round($totalDiscount, 2),
            'campaign_discount' => round($campaignDiscount, 2),
            'coupon_discount' => round($couponDiscount, 2),
            'shipping' => round($totalShipping, 2),
            'total' => round($subtotal - $totalDiscount + $totalShipping, 2),
            'item_count' => $this->items->sum('quantity'),
            'shipping_breakdown' => $shippingBreakdown,
            'campaign_breakdown' => $campaignBreakdown,
        ];
    }

    /**
     * Kampanya indirimlerini hesapla (X al Y öde)
     */
    protected function calculateCampaignDiscounts(): array
    {
        $this->load('items.product');
        
        $breakdown = [];
        $totalDiscount = 0;
        
        // Ürün bazında kampanyaları grupla
        $productQuantities = [];
        foreach ($this->items as $item) {
            $productId = $item->product_id;
            if (!isset($productQuantities[$productId])) {
                $productQuantities[$productId] = [
                    'quantity' => 0,
                    'unit_price' => $item->unit_price,
                    'product_name' => $item->product->name ?? 'Ürün',
                ];
            }
            $productQuantities[$productId]['quantity'] += $item->quantity;
        }
        
        // Her ürün için aktif kampanya kontrol et
        foreach ($productQuantities as $productId => $data) {
            $campaign = VendorCampaign::getActiveForProduct($productId);
            
            if (!$campaign) {
                continue;
            }
            
            $quantity = $data['quantity'];
            $unitPrice = $data['unit_price'];
            
            // X al Y öde hesaplaması
            if ($quantity >= $campaign->buy_quantity) {
                $discount = $campaign->calculateDiscount($quantity, $unitPrice);
                
                if ($discount > 0) {
                    $totalDiscount += $discount;
                    $breakdown[] = [
                        'product_id' => $productId,
                        'product_name' => $data['product_name'],
                        'campaign_name' => $campaign->name,
                        'campaign_type' => "{$campaign->buy_quantity} Al {$campaign->pay_quantity} Öde",
                        'quantity' => $quantity,
                        'discount' => round($discount, 2),
                    ];
                }
            }
        }
        
        return [
            'total_discount' => $totalDiscount,
            'breakdown' => $breakdown,
        ];
    }

    /**
     * Satıcı bazlı kargo hesaplaması
     * 
     * @return array
     */
    protected function calculateShippingByVendor(): array
    {
        // Product ilişkisini eager load et
        $this->load('items.product.vendor');
        
        // Satıcıya göre grupla
        $vendorSubtotals = [];
        
        foreach ($this->items as $item) {
            $vendorId = $item->product->vendor_id ?? null;
            
            if (!$vendorId) {
                continue;
            }
            
            if (!isset($vendorSubtotals[$vendorId])) {
                $vendorSubtotals[$vendorId] = [
                    'vendor_id' => $vendorId,
                    'vendor_name' => $item->product->vendor->company_name ?? $item->product->vendor->name ?? 'Satıcı',
                    'subtotal' => 0,
                    'item_count' => 0,
                ];
            }
            
            $vendorSubtotals[$vendorId]['subtotal'] += $item->unit_price * $item->quantity;
            $vendorSubtotals[$vendorId]['item_count'] += $item->quantity;
        }
        
        // Her satıcı için kargo hesapla
        $breakdown = [];
        
        foreach ($vendorSubtotals as $vendorId => $data) {
            $shippingSettings = VendorShippingSetting::getSettingsForVendor($vendorId);
            $shippingCost = $shippingSettings->calculateShippingCost($data['subtotal']);
            $remaining = $shippingSettings->getRemainingForFreeShipping($data['subtotal']);
            
            $breakdown[] = [
                'vendor_id' => $vendorId,
                'vendor_name' => $data['vendor_name'],
                'subtotal' => round($data['subtotal'], 2),
                'item_count' => $data['item_count'],
                'shipping_cost' => round($shippingCost, 2),
                'is_free' => $shippingCost == 0,
                'free_shipping_threshold' => (float) $shippingSettings->free_shipping_threshold,
                'remaining_for_free' => $remaining !== null ? round($remaining, 2) : null,
            ];
        }
        
        return $breakdown;
    }

    /**
     * Kullanıcı veya session_id ile sepeti bul veya oluştur
     */
    public static function findOrCreateForUser(?int $userId, ?string $sessionId): self
    {
        if ($userId) {
            return self::firstOrCreate(['user_id' => $userId]);
        }

        return self::firstOrCreate(['session_id' => $sessionId]);
    }

    /**
     * Misafir sepetini kullanıcıya aktar
     */
    public function mergeWithUserCart(int $userId): void
    {
        $userCart = self::firstOrCreate(['user_id' => $userId]);

        foreach ($this->items as $item) {
            $existingItem = $userCart->items()
                ->where('product_id', $item->product_id)
                ->where('variant_id', $item->variant_id)
                ->first();

            if ($existingItem) {
                $existingItem->increment('quantity', $item->quantity);
            } else {
                $userCart->items()->create([
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                ]);
            }
        }

        // Eski sepeti sil
        $this->delete();
    }
}
