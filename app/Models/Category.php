<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'icon',
        'image',
        'description',
        'settings',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => true,
    ];

    /**
     * Kategoriye bağlı ürünler
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'category_product');
    }

    /**
     * Doğrudan kategoriye bağlı ürünler (category_id üzerinden)
     */
    public function directProducts()
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    /**
     * Bu kategoride ürün satma yetkisi olan satıcılar
     */
    public function vendors()
    {
        return $this->belongsToMany(Vendor::class, 'vendor_categories')
                    ->withTimestamps();
    }

    /**
     * Üst kategori
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Alt kategoriler
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Aktif alt kategoriler
     */
    public function activeChildren()
    {
        return $this->hasMany(Category::class, 'parent_id')->where('is_active', true);
    }

    /**
     * Tüm alt kategoriler (recursive)
     */
    public function allChildren()
    {
        return $this->children()->with('allChildren');
    }

    /**
     * Sadece ana kategoriler (parent_id = null)
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Sadece aktif kategoriler
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Sıralı kategoriler
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Kategorinin tam yolunu döndür (Breadcrumb için)
     */
    public function getPathAttribute(): array
    {
        $path = [];
        $category = $this;
        
        while ($category) {
            array_unshift($path, [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug
            ]);
            $category = $category->parent;
        }
        
        return $path;
    }

    /**
     * Kategori ürün sayısı (alt kategoriler dahil)
     */
    public function getTotalProductCountAttribute(): int
    {
        $count = $this->directProducts()->count();
        
        foreach ($this->children as $child) {
            $count += $child->total_product_count;
        }
        
        return $count;
    }
}
