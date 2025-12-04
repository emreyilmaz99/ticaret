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
        'tax_id',
        'password',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
        // iyzico SubMerchant fields (full_application için)
        'merchant_type',
        'identity_number',
        'contact_name',
        'contact_surname',
        'tax_office',
        'legal_company_title',
        'iban',
        'address',
        'city',
        'district',
        'postal_code',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'merchant_type' => 'string',
    ];

    // Types
    public const TYPE_PRE_APPLICATION = 'pre_application';
    public const TYPE_FULL_APPLICATION = 'full_application';

    // Statuses
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    // Merchant Types (same as Vendor model)
    public const MERCHANT_TYPE_PERSONAL = 'personal';
    public const MERCHANT_TYPE_PRIVATE_COMPANY = 'private_company';
    public const MERCHANT_TYPE_LIMITED_COMPANY = 'limited_company';

    public static function merchantTypes(): array
    {
        return [
            self::MERCHANT_TYPE_PERSONAL,
            self::MERCHANT_TYPE_PRIVATE_COMPANY,
            self::MERCHANT_TYPE_LIMITED_COMPANY,
        ];
    }

    /**
     * Get full address string for iyzico
     */
    public function getFullAddressAttribute(): ?string
    {
        $parts = array_filter([
            $this->address,
            $this->district,
            $this->city,
        ]);
        
        return !empty($parts) ? implode(', ', $parts) : null;
    }

    /**
     * iyzico için gerekli tüm bilgiler mevcut mu?
     */
    public function hasCompleteIyzicoData(): bool
    {
        // Temel alanlar
        if (empty($this->merchant_type) || empty($this->iban) || empty($this->address)) {
            return false;
        }

        return match($this->merchant_type) {
            self::MERCHANT_TYPE_PERSONAL => 
                !empty($this->identity_number) && 
                !empty($this->contact_name) && 
                !empty($this->contact_surname),
            
            self::MERCHANT_TYPE_PRIVATE_COMPANY => 
                !empty($this->identity_number) && 
                !empty($this->tax_office) && 
                !empty($this->legal_company_title),
            
            self::MERCHANT_TYPE_LIMITED_COMPANY => 
                !empty($this->tax_id) && 
                !empty($this->tax_office) && 
                !empty($this->legal_company_title),
            
            default => false,
        };
    }

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
