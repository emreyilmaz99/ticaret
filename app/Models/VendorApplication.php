<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorApplication extends Model
{
    protected $fillable = [
        'vendor_id',
        'type',
        'status',
        'email',
        'full_name',
        'company_name',
        'phone',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    // Types
    public const TYPE_PRE_APPLICATION = 'pre_application';
    public const TYPE_FULL_APPLICATION = 'full_application';

    // Statuses
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    /**
     * Get the vendor that owns this application
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the admin who reviewed this application
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'reviewed_by');
    }

    // Scopes
    public function scopePreApplication($query)
    {
        return $query->where('type', self::TYPE_PRE_APPLICATION);
    }

    public function scopeFullApplication($query)
    {
        return $query->where('type', self::TYPE_FULL_APPLICATION);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    // Helpers
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isPreApplication(): bool
    {
        return $this->type === self::TYPE_PRE_APPLICATION;
    }

    public function isFullApplication(): bool
    {
        return $this->type === self::TYPE_FULL_APPLICATION;
    }
}
