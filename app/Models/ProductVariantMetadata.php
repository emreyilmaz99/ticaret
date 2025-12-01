<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariantMetadata extends Model
{
    protected $table = 'product_variant_metadata';

    protected $fillable = [
        'variant_id',
        'meta_key',
        'meta_value',
    ];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
