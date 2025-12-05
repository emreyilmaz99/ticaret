<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderStatusHistory extends Model
{
    protected $table = 'order_status_history';

    protected $fillable = [
        'order_id',
        'old_status',
        'new_status',
        'note',
        'changed_by_type',
        'changed_by_id',
    ];

    // ==================== İLİŞKİLER ====================

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Değişikliği yapan kişiyi al (polymorphic)
     */
    public function changedBy()
    {
        if (!$this->changed_by_type || !$this->changed_by_id) {
            return null;
        }

        return match ($this->changed_by_type) {
            'user' => User::find($this->changed_by_id),
            'vendor' => Vendor::find($this->changed_by_id),
            'admin' => Admin::find($this->changed_by_id),
            default => null,
        };
    }

    /**
     * Değişikliği yapan kişinin adı
     */
    public function getChangedByNameAttribute(): string
    {
        if ($this->changed_by_type === 'system') {
            return 'Sistem';
        }

        $actor = $this->changedBy();
        
        return $actor?->name ?? $actor?->company_name ?? 'Bilinmiyor';
    }

    // ==================== LABEL'LAR ====================

    public function getOldStatusLabelAttribute(): string
    {
        return Order::statusLabels()[$this->old_status] ?? $this->old_status ?? '-';
    }

    public function getNewStatusLabelAttribute(): string
    {
        return Order::statusLabels()[$this->new_status] ?? $this->new_status;
    }
}
