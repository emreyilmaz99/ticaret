<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaxClass extends Model
{
    protected $fillable = [
        'name',
        'rate',
        'description',
        'is_default',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'rate' => 'decimal:2',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // ==================== İLİŞKİLER ====================

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // ==================== SCOPES ====================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('rate');
    }

    // ==================== ACCESSOR & MUTATORS ====================

    /**
     * Vergi oranını yüzde olarak döner (18.00 -> "%18")
     */
    public function getRatePercentAttribute(): string
    {
        return '%' . number_format($this->rate, 0);
    }

    /**
     * Ürün sayısını döner (cache edilebilir)
     */
    public function getProductsCountAttribute(): int
    {
        return $this->products()->count();
    }

    // ==================== HELPER METHODS ====================

    /**
     * Verilen fiyat için KDV tutarını hesapla
     * 
     * @param float $price KDV Hariç Fiyat
     * @return float KDV Tutarı
     */
    public function calculateTaxAmount(float $price): float
    {
        return round($price * ($this->rate / 100), 2);
    }

    /**
     * Verilen fiyat için KDV Dahil tutarı hesapla
     * 
     * @param float $priceExcludingTax KDV Hariç Fiyat
     * @return float KDV Dahil Fiyat
     */
    public function calculatePriceIncludingTax(float $priceExcludingTax): float
    {
        return round($priceExcludingTax + $this->calculateTaxAmount($priceExcludingTax), 2);
    }

    /**
     * KDV Dahil fiyattan KDV Hariç fiyatı hesapla (ters işlem)
     * 
     * @param float $priceIncludingTax KDV Dahil Fiyat
     * @return float KDV Hariç Fiyat
     */
    public function calculatePriceExcludingTax(float $priceIncludingTax): float
    {
        return round($priceIncludingTax / (1 + ($this->rate / 100)), 2);
    }

    /**
     * Varsayılan vergi sınıfı olarak işaretle (diğerlerini kaldır)
     */
    public function setAsDefault(): bool
    {
        // Önce tüm varsayılanları kaldır
        self::where('is_default', true)->update(['is_default' => false]);
        
        // Bu vergi sınıfını varsayılan yap
        $this->is_default = true;
        return $this->save();
    }

    /**
     * Aktif/Pasif durumu değiştir
     */
    public function toggleActive(): bool
    {
        $this->is_active = !$this->is_active;
        return $this->save();
    }

    /**
     * Silinebilir mi kontrol et (ürün bağlı değilse)
     */
    public function canBeDeleted(): bool
    {
        return $this->products()->count() === 0;
    }
}
