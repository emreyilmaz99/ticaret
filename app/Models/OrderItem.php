<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    // Sipariş kalemi durumları
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_REFUNDED = 'refunded';

    protected $fillable = [
        'order_id',
        'vendor_id',
        'product_id',
        'variant_id',
        'product_name',
        'variant_title',
        'sku',
        'quantity',
        'unit_price',
        'line_total',
        'tax_rate',
        'tax_amount',
        'campaign_discount',
        'campaign_name',
        'submerchant_key',
        'submerchant_price',
        'commission_rate',
        'commission_amount',
        'iyzico_item_id',
        'iyzico_payment_transaction_id',
        'iyzico_transaction_status',
        'status',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'line_total' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'campaign_discount' => 'decimal:2',
        'submerchant_price' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'iyzico_transaction_status' => 'integer',
    ];

    // ==================== İLİŞKİLER ====================

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /**
     * Get review for this order item (including soft deleted)
     */
    public function review()
    {
        return $this->hasOne(ProductReview::class, 'order_item_id')->withTrashed();
    }

    // ==================== YORUM YÖNETİMİ ====================

    /**
     * Check if this item can be reviewed
     */
    public function getCanBeReviewedAttribute(): bool
    {
        return $this->order->canBeReviewed() && !$this->isReviewed();
    }

    /**
     * Check if this item has been reviewed
     */
    public function isReviewed(): bool
    {
        return $this->review()->withTrashed()->exists();
    }

    // ==================== DURUM YÖNETİMİ ====================

    public function updateStatus(string $newStatus): bool
    {
        $this->status = $newStatus;
        return $this->save();
    }

    // ==================== KONTROLLER ====================

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isShipped(): bool
    {
        return $this->status === self::STATUS_SHIPPED;
    }

    public function isDelivered(): bool
    {
        return $this->status === self::STATUS_DELIVERED;
    }

    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function isRefunded(): bool
    {
        return $this->status === self::STATUS_REFUNDED;
    }

    // ==================== HESAPLAMALAR ====================

    /**
     * Net tutar (kampanya indirimi düşülmüş)
     */
    public function getNetTotalAttribute(): float
    {
        return $this->line_total - $this->campaign_discount;
    }

    // ==================== LABEL'LAR ====================

    public static function statusLabels(): array
    {
        return [
            self::STATUS_PENDING => 'Bekliyor',
            self::STATUS_PROCESSING => 'Hazırlanıyor',
            self::STATUS_SHIPPED => 'Kargoda',
            self::STATUS_DELIVERED => 'Teslim Edildi',
            self::STATUS_CANCELLED => 'İptal',
            self::STATUS_REFUNDED => 'İade',
        ];
    }

    public function getStatusLabelAttribute(): string
    {
        return self::statusLabels()[$this->status] ?? $this->status;
    }

    // ==================== SCOPES ====================

    public function scopeForVendor($query, int $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }
}
