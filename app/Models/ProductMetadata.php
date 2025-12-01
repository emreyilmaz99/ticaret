<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductMetadata extends Model
{
    protected $table = 'product_metadata';

    protected $fillable = [
        'product_id',
        'meta_key',
        'meta_value',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
