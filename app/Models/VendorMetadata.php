<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorMetadata extends Model
{
    protected $table = 'vendor_metadata';

    protected $fillable = [
        'vendor_id',
        'meta_key',
        'meta_value',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}
