<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    // Sipariş durumları (status) - Kargo/İşlem Durumu
    public const STATUS_PENDING = 'pending';           // Beklemede (ödeme bekleniyor)
    public const STATUS_CONFIRMED = 'confirmed';       // Onaylandı (ödeme alındı, hazırlanmayı bekliyor)
    public const STATUS_PROCESSING = 'processing';     // Hazırlanıyor
    public const STATUS_SHIPPED = 'shipped';           // Kargoya Verildi
    public const STATUS_DELIVERED = 'delivered';       // Teslim Edildi
    public const STATUS_CANCELLED = 'cancelled';       // İptal Edildi
    public const STATUS_RETURNED = 'returned';         // İade Edildi

    // Ödeme durumları (payment_status) - Sadece Ödeme
    public const PAYMENT_PENDING = 'pending';          // Ödeme Bekleniyor
    public const PAYMENT_PROCESSING = 'processing';    // Ödeme İşleniyor
    public const PAYMENT_PAID = 'paid';                // Ödendi
    public const PAYMENT_FAILED = 'failed';            // Ödeme Başarısız
    public const PAYMENT_REFUNDED = 'refunded';        // İade Edildi (para iadesi)

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_status',
        'shipping_address',
        'billing_address',
        'subtotal',
        'shipping_total',
        'discount_total',
        'campaign_discount',
        'coupon_discount',
        'total',
        'currency',
        'coupon_code',
        'coupon_id',
        'iyzico_token',
        'iyzico_conversation_id',
        'iyzico_payment_id',
        'iyzico_fraud_status',
        'iyzico_raw_response',
        'card_type',
        'card_association',
        'card_family',
        'card_bin',
        'card_last_four',
        'installment_count',
        'notes',
        'paid_at',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'iyzico_raw_response' => 'array',
        'subtotal' => 'decimal:2',
        'shipping_total' => 'decimal:2',
        'discount_total' => 'decimal:2',
        'campaign_discount' => 'decimal:2',
        'coupon_discount' => 'decimal:2',
        'total' => 'decimal:2',
        'installment_count' => 'integer',
        'iyzico_fraud_status' => 'integer',
        'paid_at' => 'datetime',
    ];

    /**
     * Appended accessors
     */
    protected $appends = ['can_cancel'];

    /**
     * Temporary attribute to pass metadata to observer (not persisted to database)
     */
    public ?array $statusChangeMetadata = null;

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = self::generateOrderNumber();
            }
        });
    }

    /**
     * Generate unique order number
     * Format: ORD-YYMMDD-XXXXX
     */
    public static function generateOrderNumber(): string
    {
        $date = now()->format('ymd');
        $random = strtoupper(Str::random(5));
        $orderNumber = "ORD-{$date}-{$random}";
        
        // Ensure uniqueness
        while (self::where('order_number', $orderNumber)->exists()) {
            $random = strtoupper(Str::random(5));
            $orderNumber = "ORD-{$date}-{$random}";
        }
        
        return $orderNumber;
    }

    // ==================== İLİŞKİLER ====================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Alias for items() relationship
     */
    public function orderItems(): HasMany
    {
        return $this->items();
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at', 'desc');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(OrderNote::class)->orderBy('created_at', 'desc');
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(VendorCoupon::class, 'coupon_id');
    }

    // ==================== YORUM YÖNETİMİ ====================

    /**
     * Check if order can be reviewed
     * Only delivered orders can be reviewed
     */
    public function canBeReviewed(): bool
    {
        return $this->status === self::STATUS_DELIVERED;
    }

    /**
     * Get items that can be reviewed (delivered + not yet reviewed)
     */
    public function getReviewableItems()
    {
        if (!$this->canBeReviewed()) {
            return collect([]);
        }

        return $this->items()
            ->with(['product', 'variant'])
            ->whereDoesntHave('review', function ($query) {
                $query->withTrashed();
            })
            ->get();
    }

    // ==================== DURUM YÖNETİMİ ====================

    /**
     * Durumu güncelle ve geçmişe kaydet
     * Note: Status history is now automatically created by OrderObserver
     */
    public function updateStatus(string $newStatus, ?string $note = null, ?string $changedByType = null, ?int $changedById = null): bool
    {
        if ($this->status === $newStatus) {
            return false;
        }

        // Store metadata for observer if provided
        if ($note || $changedByType || $changedById) {
            $this->statusChangeMetadata = [
                'note' => $note,
                'changed_by_type' => $changedByType,
                'changed_by_id' => $changedById,
            ];
        }

        $this->status = $newStatus;
        $this->save(); // Observer will automatically create status history

        return true;
    }

    /**
     * Ödeme durumunu güncelle
     */
    public function updatePaymentStatus(string $newStatus): bool
    {
        $this->payment_status = $newStatus;
        
        if ($newStatus === self::PAYMENT_PAID) {
            $this->paid_at = now();
            // Ödeme başarılı olunca sipariş durumunu "onaylandı" yap
            $this->status = self::STATUS_CONFIRMED;
        }
        
        return $this->save();
    }

    // ==================== KONTROLLER ====================

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isPaid(): bool
    {
        return $this->payment_status === self::PAYMENT_PAID;
    }

    public function isCancellable(): bool
    {
        // Sadece beklemede ve onaylanmış siparişler iptal edilebilir
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_CONFIRMED]);
    }

    /**
     * Accessor for can_cancel attribute
     */
    public function getCanCancelAttribute(): bool
    {
        return $this->isCancellable();
    }

    public function isRefundable(): bool
    {
        // Ödeme yapılmış ve iptal/iade edilmemiş siparişler iade edilebilir
        return $this->isPaid() && !in_array($this->status, [self::STATUS_RETURNED, self::STATUS_CANCELLED]);
    }

    // ==================== HESAPLAMALAR ====================

    /**
     * Satıcı bazlı sipariş özeti
     */
    public function getVendorSummaryAttribute(): array
    {
        return $this->items
            ->groupBy('vendor_id')
            ->map(function ($items, $vendorId) {
                $vendor = Vendor::find($vendorId);
                return [
                    'vendor_id' => $vendorId,
                    'vendor_name' => $vendor?->company_name ?? $vendor?->name ?? 'Satıcı',
                    'item_count' => $items->sum('quantity'),
                    'subtotal' => $items->sum('line_total'),
                    'submerchant_total' => $items->sum('submerchant_price'),
                    'commission_total' => $items->sum('commission_amount'),
                    'items' => $items,
                ];
            })
            ->values()
            ->toArray();
    }

    // ==================== LABEL'LAR ====================

    public static function statusLabels(): array
    {
        return [
            self::STATUS_PENDING => 'Beklemede',
            self::STATUS_CONFIRMED => 'Onaylandı',
            self::STATUS_PROCESSING => 'Hazırlanıyor',
            self::STATUS_SHIPPED => 'Kargoya Verildi',
            self::STATUS_DELIVERED => 'Teslim Edildi',
            self::STATUS_CANCELLED => 'İptal Edildi',
            self::STATUS_RETURNED => 'İade Edildi',
        ];
    }

    public static function paymentStatusLabels(): array
    {
        return [
            self::PAYMENT_PENDING => 'Bekleniyor',
            self::PAYMENT_PROCESSING => 'İşleniyor',
            self::PAYMENT_PAID => 'Ödendi',
            self::PAYMENT_FAILED => 'Başarısız',
            self::PAYMENT_REFUNDED => 'İade Edildi',
        ];
    }

    public function getStatusLabelAttribute(): string
    {
        return self::statusLabels()[$this->status] ?? $this->status;
    }

    public function getPaymentStatusLabelAttribute(): string
    {
        return self::paymentStatusLabels()[$this->payment_status] ?? $this->payment_status;
    }

    // ==================== SCOPES ====================

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', self::PAYMENT_PAID);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
