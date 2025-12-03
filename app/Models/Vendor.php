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
        'application_id',
        'commission_plan_id',
        'name',
        'email',
        'password',
        'company_name',
        'slug',
        'tax_id',
        'phone',
        // Removed: 'logo_path', 'cover_path' - now in vendor_media table
        'rating_avg',     // Computed field for performance
        'rating_count',   // Computed field for performance
        'balance',
        'commission_rate',
        // Removed: 'settings', 'metadata' - now in separate tables
        'status',
        'onboarding_completed',
        'activated_at',
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
        'status' => 'string',
        'onboarding_completed' => 'boolean',
        'activated_at' => 'datetime',
    ];
    
    /**
     * Set the password attribute.
     * Only hash if the value is not already hashed (bcrypt hashes start with $2y$)
     */
    public function setPasswordAttribute($value)
    {
        if ($value !== null && $value !== '') {
            // Check if already hashed (bcrypt format)
            if (str_starts_with($value, '$2y$') || str_starts_with($value, '$2a$') || str_starts_with($value, '$2b$')) {
                $this->attributes['password'] = $value;
            } else {
                $this->attributes['password'] = bcrypt($value);
            }
        }
    }

    // Relationships
    public function application()
    {
        return $this->belongsTo(VendorApplication::class);
    }

    public function applications()
    {
        return $this->hasMany(VendorApplication::class);
    }

    public function commissionPlan()
    {
        return $this->belongsTo(CommissionPlan::class);
    }

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

    public function media()
    {
        return $this->hasMany(VendorMedia::class);
    }

    public function settings()
    {
        return $this->hasMany(VendorSetting::class);
    }

    public function metadata()
    {
        return $this->hasMany(VendorMetadata::class);
    }

    public function ratings()
    {
        return $this->hasMany(VendorRating::class);
    }

    public function approvedRatings()
    {
        return $this->hasMany(VendorRating::class)->approved();
    }

    /**
     * Satıcının yetkili olduğu kategoriler
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'vendor_categories')
                    ->withTimestamps();
    }

    /**
     * Satıcının seçtiği/yetkili kategoriler (alias for categories)
     */
    public function allowedCategories()
    {
        return $this->belongsToMany(Category::class, 'vendor_categories')
                    ->withTimestamps();
    }

    /**
     * Satıcının yetkili olduğu kategori ID'leri
     */
    public function getCategoryIdsAttribute(): array
    {
        return $this->categories()->pluck('categories.id')->toArray();
    }

    /**
     * Satıcının bu kategoride ürün ekleyip ekleyemeyeceğini kontrol et
     */
    public function canAddProductInCategory(int $categoryId): bool
    {
        // Eğer satıcının hiç kategorisi yoksa, tüm kategorilere ekleyebilir (eski davranış)
        if ($this->categories()->count() === 0) {
            return true;
        }
        
        // Satıcının yetkili kategorilerini kontrol et
        $allowedCategoryIds = $this->categories()->pluck('categories.id')->toArray();
        
        // Kategori veya üst kategorilerinden biri yetkili mi?
        $category = Category::find($categoryId);
        while ($category) {
            if (in_array($category->id, $allowedCategoryIds)) {
                return true;
            }
            $category = $category->parent;
        }
        
        return false;
    }

    // Vendor status constants (simplified - application status moved to vendor_applications)
    public const STATUS_ACTIVE = 'active';       // Aktif - işlem yapabilir
    public const STATUS_INACTIVE = 'inactive';   // Pasif - geçici durduruldu
    public const STATUS_SUSPENDED = 'suspended'; // Askıya alındı
    public const STATUS_BANNED = 'banned';       // Yasaklandı

    public static function statuses(): array
    {
        return [
            self::STATUS_ACTIVE,
            self::STATUS_INACTIVE,
            self::STATUS_SUSPENDED,
            self::STATUS_BANNED,
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeInactive($query)
    {
        return $query->where('status', self::STATUS_INACTIVE);
    }

    /**
     * Check if vendor has completed onboarding
     */
    public function hasCompletedOnboarding(): bool
    {
        return $this->onboarding_completed === true;
    }

    /**
     * Check if vendor is active and can operate
     */
    public function canOperate(): bool
    {
        return $this->status === self::STATUS_ACTIVE && $this->hasCompletedOnboarding();
    }
}
