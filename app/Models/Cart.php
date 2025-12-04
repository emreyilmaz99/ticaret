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
     * Sepet toplamlarını hesapla
     */
    public function getTotalsAttribute(): array
    {
        $subtotal = $this->items->sum(function ($item) {
            return $item->unit_price * $item->quantity;
        });

        $shipping = $subtotal > 1000 ? 0 : 29.90;
        $discount = $this->discount_amount ?? 0;

        return [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping' => $shipping,
            'total' => $subtotal - $discount + $shipping,
            'item_count' => $this->items->sum('quantity'),
        ];
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
