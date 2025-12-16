<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id','vendor_id','category_id','sku','slug','name','short_description','description','type','status','is_featured','tax_class_id','commission_plan_id',
        'rejection_reason','rejected_at','rejected_by'
        // Removed variant-specific fields: 'price','compare_at_price','weight','length','width','height'
        // These now live in product_variants table only
        // Removed: 'settings', 'metadata' - now in separate tables
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'rejected_at' => 'datetime',
        // Removed: 'settings' => 'array', 'metadata' => 'array'
    ];

    protected $appends = [
        'image',
    ];

    /**
     * Get main product image URL
     */
    public function getImageAttribute(): ?string
    {
        // Use already loaded photos relation if available
        if ($this->relationLoaded('photos')) {
            $mainPhoto = $this->photos->sortBy('sort_order')->first();
        } else {
            $mainPhoto = $this->photos()->orderBy('sort_order')->first();
        }
        
        if ($mainPhoto) {
            // Return file_path accessor which handles URL generation
            return $mainPhoto->file_path;
        }
        return null;
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function category()
    {
        return $this->belongsTo(\App\Models\Category::class, 'category_id');
    }

    public function taxClass()
    {
        return $this->belongsTo(TaxClass::class);
    }

    public function commissionPlan()
    {
        return $this->belongsTo(CommissionPlan::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'product_tag');
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function photos()
    {
        return $this->hasMany(ProductPhoto::class)->orderBy('sort_order')->orderBy('id');
    }

    public function settings()
    {
        return $this->hasMany(ProductSetting::class);
    }

    public function productMetadata()
    {
        return $this->hasMany(ProductMetadata::class);
    }

    public function rejectedByAdmin()
    {
        return $this->belongsTo(Admin::class, 'rejected_by');
    }

    /**
     * Get active featured deal for this product
     * Returns only current (active + within date range) featured deal
     */
    public function activeFeaturedDeal()
    {
        return $this->hasOne(FeaturedDeal::class, 'product_id')
            ->where('is_active', true)
            ->where(function($query) {
                $now = now();
                $query->where(function($q) use ($now) {
                    $q->whereNull('starts_at')
                      ->orWhere('starts_at', '<=', $now);
                })
                ->where(function($q) use ($now) {
                    $q->whereNull('ends_at')
                      ->orWhere('ends_at', '>', $now);
                });
            })
            ->orderBy('sort_order');
    }

    /**
     * Get all featured deals (including inactive/expired)
     */
    public function featuredDeals()
    {
        return $this->hasMany(FeaturedDeal::class, 'product_id');
    }

    /**
     * Get all reviews (including pending/rejected)
     */
    public function reviews()
    {
        return $this->hasMany(ProductReview::class, 'product_id');
    }

    /**
     * Get only approved reviews
     */
    public function approvedReviews()
    {
        return $this->hasMany(ProductReview::class, 'product_id')
            ->where('status', 'approved');
    }

    /**
     * Get average rating (cached for 10 minutes)
     */
    public function getAverageRatingAttribute()
    {
        return \Illuminate\Support\Facades\Cache::remember(
            "product:{$this->id}:avg_rating",
            600,
            fn() => round($this->approvedReviews()->avg('rating') ?? 0, 1)
        );
    }

    /**
     * Get review count (cached for 10 minutes)
     */
    public function getReviewCountAttribute()
    {
        return \Illuminate\Support\Facades\Cache::remember(
            "product:{$this->id}:review_count",
            600,
            fn() => $this->approvedReviews()->count()
        );
    }

    /**
     * Get rating breakdown (cached for 10 minutes)
     * Returns ['1' => count, '2' => count, ...]
     */
    public function ratingBreakdown()
    {
        return \Illuminate\Support\Facades\Cache::remember(
            "product:{$this->id}:rating_breakdown",
            600,
            function () {
                $breakdown = [];
                $reviews = $this->approvedReviews()->get();
                
                for ($i = 1; $i <= 5; $i++) {
                    $breakdown[$i] = $reviews->where('rating', $i)->count();
                }
                
                return $breakdown;
            }
        );
    }

    /**
     * Check if a user has reviewed this product
     */
    public function hasUserReviewed(?User $user)
    {
        if (!$user) {
            return false;
        }

        return $this->reviews()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        // Load relations if not already loaded
        if (!$this->relationLoaded('vendor')) {
            $this->load('vendor');
        }
        if (!$this->relationLoaded('category')) {
            $this->load('category');
        }
        if (!$this->relationLoaded('variants')) {
            $this->load('variants');
        }

        // Get min/max prices from variants
        $prices = $this->variants->pluck('price')->filter();
        $minPrice = $prices->min();
        $maxPrice = $prices->max();
        $inStock = $this->variants->sum('stock') > 0;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'type' => $this->type,
            'vendor_id' => $this->vendor_id,
            'vendor_name' => $this->vendor?->name,
            'vendor_slug' => $this->vendor?->slug,
            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,
            'category_slug' => $this->category?->slug,
            'min_price' => $minPrice,
            'max_price' => $maxPrice,
            'in_stock' => $inStock,
            'created_at' => $this->created_at?->timestamp,
            'updated_at' => $this->updated_at?->timestamp,
        ];
    }

    /**
     * Get the index name for the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        return 'products_index';
    }

    /**
     * Determine if the model should be searchable.
     *
     * @return bool
     */
    public function shouldBeSearchable()
    {
        // Only index active products
        return $this->status === 'active';
    }

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::ulid();
            }
        });
    }
}
