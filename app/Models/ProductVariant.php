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
}
