<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon;

class VendorCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'name',
        'description',
        'buy_quantity',
        'pay_quantity',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected $casts = [
        'buy_quantity' => 'integer',
        'pay_quantity' => 'integer',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Vendor ilişkisi
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Kampanyaya dahil ürünler
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'campaign_products', 'campaign_id', 'product_id')
            ->withTimestamps();
    }

    /**
     * Kampanyanın aktif olup olmadığını kontrol et
     */
    public function isActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = Carbon::now();

        return $now->gte($this->starts_at) && $now->lte($this->ends_at);
    }

    /**
     * X al Y öde indirimini hesapla
     * Örn: 3 al 2 öde -> 3 üründen 1'i bedava
     */
    public function calculateDiscount(int $quantity, float $unitPrice): float
    {
        if ($quantity < $this->buy_quantity) {
            return 0;
        }

        // Kaç set oluşuyor?
        $sets = floor($quantity / $this->buy_quantity);
        
        // Her sette kaç ürün bedava?
        $freePerSet = $this->buy_quantity - $this->pay_quantity;
        
        // Toplam bedava ürün sayısı
        $totalFree = $sets * $freePerSet;

        return $totalFree * $unitPrice;
    }

    /**
     * Aktif kampanyaları filtrele
     */
    public function scopeActive($query)
    {
        $now = Carbon::now();
        return $query->where('is_active', true)
            ->where('starts_at', '<=', $now)
            ->where('ends_at', '>=', $now);
    }

    /**
     * Belirli bir ürün için aktif kampanyayı bul
     */
    public static function getActiveForProduct(string $productId): ?self
    {
        return static::active()
            ->whereHas('products', function ($q) use ($productId) {
                $q->where('products.id', $productId);
            })
            ->first();
    }
}
