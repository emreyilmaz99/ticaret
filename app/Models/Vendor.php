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
        // Removed: 'commission_rate' - use commission_plan_id instead
        // Removed: 'settings', 'metadata' - now in separate tables
        'status',
        'onboarding_completed',
        'activated_at',
        // iyzico SubMerchant fields
        'merchant_type',
        'identity_number',
        'contact_name',
        'contact_surname',
        'tax_office',
        'legal_company_title',
        'iyzico_submerchant_key',
        'iyzico_status',
        'iyzico_registered_at',
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
        // iyzico fields
        'merchant_type' => 'string',
        'iyzico_status' => 'string',
        'iyzico_registered_at' => 'datetime',
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

    /**
     * Kargo ayarları ilişkisi
     */
    public function shippingSetting()
    {
        return $this->hasOne(VendorShippingSetting::class);
    }

    /**
     * Verilen sepet alt toplamı için kargo ücretini hesapla
     * Kargo ayarı yoksa varsayılan değerler kullanılır
     * 
     * @param float $subtotal Sepet alt toplamı
     * @return float Kargo ücreti
     */
    public function calculateShippingCost(float $subtotal): float
    {
        $settings = VendorShippingSetting::getSettingsForVendor($this->id);
        return $settings->calculateShippingCost($subtotal);
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

    // Vendor status constants - Full lifecycle
    public const STATUS_PENDING_PRE_APPROVAL = 'pending_pre_approval';     // Ön başvuru bekliyor
    public const STATUS_PRE_APPROVED = 'pre_approved';                     // Ön başvuru onaylandı, temel başvuru bekleniyor
    public const STATUS_PENDING_FULL_APPROVAL = 'pending_full_approval';   // Temel başvuru onay bekliyor
    public const STATUS_ACTIVE = 'active';                                 // Aktif - işlem yapabilir
    public const STATUS_INACTIVE = 'inactive';                             // Pasif - geçici durduruldu
    public const STATUS_SUSPENDED = 'suspended';                           // Askıya alındı
    public const STATUS_BANNED = 'banned';                                 // Yasaklandı

    // iyzico SubMerchant Type constants
    public const MERCHANT_TYPE_PERSONAL = 'personal';                 // Bireysel satıcı
    public const MERCHANT_TYPE_PRIVATE_COMPANY = 'private_company';   // Şahıs şirketi
    public const MERCHANT_TYPE_LIMITED_COMPANY = 'limited_company';   // Limited/Anonim şirket

    // iyzico Status constants
    public const IYZICO_STATUS_NOT_REGISTERED = 'not_registered';
    public const IYZICO_STATUS_PENDING = 'pending';
    public const IYZICO_STATUS_ACTIVE = 'active';
    public const IYZICO_STATUS_REJECTED = 'rejected';

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING_PRE_APPROVAL,
            self::STATUS_PRE_APPROVED,
            self::STATUS_PENDING_FULL_APPROVAL,
            self::STATUS_ACTIVE,
            self::STATUS_INACTIVE,
            self::STATUS_SUSPENDED,
            self::STATUS_BANNED,
        ];
    }

    /**
     * Human readable status labels (Turkish)
     */
    public static function statusLabels(): array
    {
        return [
            self::STATUS_PENDING_PRE_APPROVAL => 'Ön Başvuru Bekleniyor',
            self::STATUS_PRE_APPROVED => 'Ön Başvuru Onaylandı',
            self::STATUS_PENDING_FULL_APPROVAL => 'Temel Başvuru İnceleniyor',
            self::STATUS_ACTIVE => 'Aktif',
            self::STATUS_INACTIVE => 'Pasif',
            self::STATUS_SUSPENDED => 'Askıya Alındı',
            self::STATUS_BANNED => 'Yasaklandı',
        ];
    }

    /**
     * Get human readable status label
     */
    public function getStatusLabelAttribute(): string
    {
        return self::statusLabels()[$this->status] ?? $this->status;
    }

    /**
     * Check if vendor needs to complete full application
     */
    public function needsFullApplication(): bool
    {
        return $this->status === self::STATUS_PRE_APPROVED;
    }

    /**
     * Check if vendor is waiting for full application approval
     */
    public function isAwaitingFullApproval(): bool
    {
        return $this->status === self::STATUS_PENDING_FULL_APPROVAL;
    }

    /**
     * Check if vendor can login
     */
    public function canLogin(): bool
    {
        return !in_array($this->status, [self::STATUS_BANNED]);
    }

    public static function merchantTypes(): array
    {
        return [
            self::MERCHANT_TYPE_PERSONAL,
            self::MERCHANT_TYPE_PRIVATE_COMPANY,
            self::MERCHANT_TYPE_LIMITED_COMPANY,
        ];
    }

    public static function iyzicoStatuses(): array
    {
        return [
            self::IYZICO_STATUS_NOT_REGISTERED,
            self::IYZICO_STATUS_PENDING,
            self::IYZICO_STATUS_ACTIVE,
            self::IYZICO_STATUS_REJECTED,
        ];
    }

    /**
     * Human readable iyzico status labels (Turkish)
     */
    public static function iyzicoStatusLabels(): array
    {
        return [
            self::IYZICO_STATUS_NOT_REGISTERED => 'Kayıtlı Değil',
            self::IYZICO_STATUS_PENDING => 'Kayıt Bekleniyor',
            self::IYZICO_STATUS_ACTIVE => 'Ödeme Alabilir',
            self::IYZICO_STATUS_REJECTED => 'Kayıt Reddedildi',
        ];
    }

    /**
     * Get human readable iyzico status label
     */
    public function getIyzicoStatusLabelAttribute(): string
    {
        return self::iyzicoStatusLabels()[$this->iyzico_status] ?? $this->iyzico_status ?? 'Bilinmiyor';
    }

    /**
     * Get rejection reason from latest application
     */
    public function getLatestRejectionReasonAttribute(): ?string
    {
        $latestApp = $this->applications()
            ->where('status', 'rejected')
            ->latest()
            ->first();
        
        return $latestApp?->rejection_reason;
    }

    /**
     * Get iyzico subMerchantType string from merchant_type
     */
    public function getIyzicoSubMerchantType(): ?string
    {
        return match($this->merchant_type) {
            self::MERCHANT_TYPE_PERSONAL => 'PERSONAL',
            self::MERCHANT_TYPE_PRIVATE_COMPANY => 'PRIVATE_COMPANY',
            self::MERCHANT_TYPE_LIMITED_COMPANY => 'LIMITED_OR_JOINT_STOCK_COMPANY',
            default => null,
        };
    }

    /**
     * Check if vendor is registered with iyzico
     */
    public function isIyzicoRegistered(): bool
    {
        return $this->iyzico_status === self::IYZICO_STATUS_ACTIVE 
            && !empty($this->iyzico_submerchant_key);
    }

    /**
     * Check if vendor can receive payments via iyzico
     */
    public function canReceivePayments(): bool
    {
        return $this->canOperate() && $this->isIyzicoRegistered();
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
