<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewResponse extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'review_id',
        'vendor_id',
        'response_text',
    ];

    protected $appends = ['response'];

    /**
     * Accessor for response field (alias for response_text)
     */
    public function getResponseAttribute(): ?string
    {
        return $this->response_text;
    }

    /**
     * Relationships
     */
    public function review(): BelongsTo
    {
        return $this->belongsTo(ProductReview::class, 'review_id');
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}
