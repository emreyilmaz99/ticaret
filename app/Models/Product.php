<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

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
            ->current()
            ->ordered();
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
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::ulid();
            }
        });
    }
}
