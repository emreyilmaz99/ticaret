<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class VendorCoupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'code',
        'name',
        'description',
        'discount_amount',
        'min_order_amount',
        'usage_limit',
        'usage_limit_per_user',
        'usage_count',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'usage_limit_per_user' => 'integer',
        'usage_count' => 'integer',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Vendor ilişkisi
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Kullanım kayıtları
     */
    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class, 'coupon_id');
    }

    /**
     * Kuponun geçerli olup olmadığını kontrol et
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = Carbon::now();

        // Başlangıç tarihi kontrolü
        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        // Bitiş tarihi kontrolü
        if ($this->expires_at && $now->gt($this->expires_at)) {
            return false;
        }

        // Kullanım limiti kontrolü
        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    /**
     * Kullanıcı için kullanılabilir mi?
     */
    public function isValidForUser(?int $userId, float $orderAmount): array
    {
        if (!$this->isValid()) {
            return ['valid' => false, 'message' => 'Bu kupon artık geçerli değil.'];
        }

        // Minimum sipariş tutarı kontrolü
        if ($orderAmount < $this->min_order_amount) {
            return [
                'valid' => false, 
                'message' => "Minimum sipariş tutarı: {$this->min_order_amount}₺"
            ];
        }

        // Kişi başı kullanım limiti kontrolü
        if ($userId && $this->usage_limit_per_user) {
            $userUsageCount = $this->usages()->where('user_id', $userId)->count();
            if ($userUsageCount >= $this->usage_limit_per_user) {
                return ['valid' => false, 'message' => 'Bu kuponu daha fazla kullanamazsınız.'];
            }
        }

        return ['valid' => true, 'message' => 'Kupon geçerli.'];
    }

    /**
     * İndirim hesapla
     */
    public function calculateDiscount(float $orderAmount): float
    {
        // Sabit tutar indirimi, sipariş tutarını aşamaz
        return min($this->discount_amount, $orderAmount);
    }

    /**
     * Kullanım sayısını artır
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }

    /**
     * Aktif ve geçerli kuponları filtrele
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        $now = Carbon::now();
        return $query->active()
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', $now);
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')->orWhereRaw('usage_count < usage_limit');
            });
    }
}
