<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Vendor extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    // Enable soft deletes so vendors can be soft-removed
    use SoftDeletes;

    protected $guard_name = 'vendor';

    protected $fillable = [
        'name',
        'email',
        'password',
        'company_name',
        'slug',
        'tax_id',
        'phone',
        'logo_path',
        'cover_path',
        'rating_avg',
        'rating_count',
        'balance',
        'commission_rate',
        'settings',
        'metadata',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'rating_avg' => 'decimal:2',
        'rating_count' => 'integer',
        'balance' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'settings' => 'array',
        'metadata' => 'array',
        'status' => 'string',
    ];
    
    public function setPasswordAttribute($value)
    {
        if ($value !== null && $value !== '') {
            $this->attributes['password'] = bcrypt($value);
        }
    }

    // Relationships
    public function addresses()
    {
        return $this->hasMany(\App\Models\VendorAddress::class);
    }

    public function bankAccounts()
    {
        return $this->hasMany(\App\Models\VendorBankAccount::class);
    }

    public function payouts()
    {
        return $this->hasMany(\App\Models\VendorPayout::class);
    }

    // Vendor status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_BANNED = 'banned';

    // Pre-application (ön başvuru) statuses
    public const STATUS_PRE_PENDING = 'pre_pending'; // ön başvuru beklemede
    public const STATUS_PRE_APPROVED = 'pre_approved'; // ön başvuru onaylandı
    public const STATUS_PRE_REJECTED = 'pre_rejected'; // ön başvuru reddedildi

    public static function statuses(): array
    {
        return [
            self::STATUS_PRE_PENDING,
            self::STATUS_PRE_APPROVED,
            self::STATUS_PRE_REJECTED,
            self::STATUS_PENDING,
            self::STATUS_ACTIVE,
            self::STATUS_INACTIVE,
            self::STATUS_BANNED,
        ];
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }
}
