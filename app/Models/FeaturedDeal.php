<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class FeaturedDeal extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'product_id',
        'variant_id',
        'deal_price',
        'original_price',
        'discount_percentage',
        'title',
        'description',
        'background_color',
        'badge_text',
        'badge_color',
        'starts_at',
        'ends_at',
        'is_active',
        'view_count',
        'click_count',
        'conversion_count',
        'sort_order',
    ];

    protected $casts = [
        'deal_price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
        'view_count' => 'integer',
        'click_count' => 'integer',
        'conversion_count' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * Relationships
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeCurrent($query)
    {
        $now = Carbon::now();
        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('ends_at')
                    ->orWhere('ends_at', '>', $now);
            });
    }

    public function scopeExpired($query)
    {
        return $query->where('ends_at', '<', Carbon::now());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('starts_at', '>', Carbon::now());
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }

    /**
     * Accessors
     */
    public function getIsActiveNowAttribute(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = Carbon::now();
        
        $startsOk = !$this->starts_at || $this->starts_at <= $now;
        $endsOk = !$this->ends_at || $this->ends_at > $now;

        return $startsOk && $endsOk;
    }

    public function getRemainingTimeAttribute(): ?array
    {
        if (!$this->ends_at) {
            return null;
        }

        $now = Carbon::now();
        
        if ($this->ends_at <= $now) {
            return [
                'expired' => true,
                'hours' => 0,
                'minutes' => 0,
                'seconds' => 0,
            ];
        }

        $diff = $now->diff($this->ends_at);

        return [
            'expired' => false,
            'days' => $diff->days,
            'hours' => $diff->h,
            'minutes' => $diff->i,
            'seconds' => $diff->s,
            'total_seconds' => $this->ends_at->timestamp - $now->timestamp,
        ];
    }

    /**
     * Methods
     */
    public function incrementViews(): void
    {
        $this->increment('view_count');
    }

    public function incrementClicks(): void
    {
        $this->increment('click_count');
    }

    public function incrementConversions(): void
    {
        $this->increment('conversion_count');
    }

    public function calculateDiscountPercentage(): float
    {
        if ($this->original_price <= 0) {
            return 0;
        }

        $discount = (($this->original_price - $this->deal_price) / $this->original_price) * 100;
        return round($discount, 2);
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($deal) {
            if (!$deal->discount_percentage) {
                $deal->discount_percentage = $deal->calculateDiscountPercentage();
            }
        });

        static::updating(function ($deal) {
            if ($deal->isDirty(['deal_price', 'original_price'])) {
                $deal->discount_percentage = $deal->calculateDiscountPercentage();
            }
        });
    }
}
