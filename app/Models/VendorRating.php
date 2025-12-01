<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorRating extends Model
{
    protected $fillable = [
        'vendor_id',
        'user_id',
        'order_id',
        'rating',
        'review',
        'is_approved',
        'approved_at',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'rating' => 'integer',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Uncomment when Order model is created
    // public function order(): BelongsTo
    // {
    //     return $this->belongsTo(Order::class);
    // }

    /**
     * Scope to get only approved ratings
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Approve the rating
     */
    public function approve(): bool
    {
        $this->is_approved = true;
        $this->approved_at = now();
        return $this->save();
    }
}
