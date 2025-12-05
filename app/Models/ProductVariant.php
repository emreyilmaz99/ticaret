<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id','sku','title','price','stock','unit_id','weight','length','width','height'
        // Removed: 'metadata' - now in product_variant_metadata table
    ];

    protected $casts = [
        // Removed: 'metadata' => 'array'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function variantMetadata()
    {
        return $this->hasMany(ProductVariantMetadata::class, 'variant_id');
    }

    // ==================== STOK YÖNETİMİ ====================

    /**
     * Stok düşür (sipariş sonrası)
     */
    public function decrementStock(int $quantity): bool
    {
        if ($quantity <= 0) {
            return false;
        }

        if ($this->stock < $quantity) {
            return false;
        }

        $this->decrement('stock', $quantity);
        return true;
    }

    /**
     * Stok artır (iade veya iptal sonrası)
     */
    public function incrementStock(int $quantity): bool
    {
        if ($quantity <= 0) {
            return false;
        }

        $this->increment('stock', $quantity);
        return true;
    }

    /**
     * Stok yeterli mi?
     */
    public function hasStock(int $quantity = 1): bool
    {
        return $this->stock >= $quantity;
    }

    /**
     * Stok durumu
     */
    public function getStockStatusAttribute(): string
    {
        if ($this->stock <= 0) {
            return 'out_of_stock';
        }
        if ($this->stock <= 5) {
            return 'low_stock';
        }
        return 'in_stock';
    }
}
