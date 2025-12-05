<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
     * Sepet toplamlarını hesapla (satıcı bazlı kargo ile)
     */
    public function getTotalsAttribute(): array
    {
        // Sepet boşsa
        if ($this->items->isEmpty()) {
            return [
                'subtotal' => 0,
                'discount' => 0,
                'shipping' => 0,
                'total' => 0,
                'item_count' => 0,
                'shipping_breakdown' => [],
            ];
        }

        // Genel alt toplam
        $subtotal = $this->items->sum(function ($item) {
            return $item->unit_price * $item->quantity;
        });

        // Satıcıya göre grupla ve kargo hesapla
        $shippingBreakdown = $this->calculateShippingByVendor();
        
        // Toplam kargo ücreti
        $totalShipping = collect($shippingBreakdown)->sum('shipping_cost');
        
        $discount = $this->discount_amount ?? 0;

        return [
            'subtotal' => round($subtotal, 2),
            'discount' => round($discount, 2),
            'shipping' => round($totalShipping, 2),
            'total' => round($subtotal - $discount + $totalShipping, 2),
            'item_count' => $this->items->sum('quantity'),
            'shipping_breakdown' => $shippingBreakdown,
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
