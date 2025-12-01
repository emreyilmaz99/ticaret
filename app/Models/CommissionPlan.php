<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommissionPlan extends Model
{
    protected $fillable = [
        'name',
        'rate',
        'description',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'rate' => 'decimal:2',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    /**
     * Get vendors using this commission plan
     */
    public function vendors(): HasMany
    {
        return $this->hasMany(Vendor::class);
    }

    /**
     * Scope for active commission plans
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for default commission plan
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
