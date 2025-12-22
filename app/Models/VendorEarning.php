<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorEarning extends Model
{
    protected $fillable = [
        'vendor_id',
        'order_id',
        'order_item_id',
        'gross_amount',
        'commission_rate',
        'commission_amount',
        'withholding_tax_rate',
        'withholding_tax_amount',
        'net_earning',
        'earning_status',
        'available_at',
        'settled_at',
        'payout_id',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'withholding_tax_rate' => 'decimal:2',
        'withholding_tax_amount' => 'decimal:2',
        'net_earning' => 'decimal:2',
        'available_at' => 'datetime',
        'settled_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function payout(): BelongsTo
    {
        return $this->belongsTo(VendorPayout::class);
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('earning_status', 'pending');
    }

    public function scopeAvailable($query)
    {
        return $query->where('earning_status', 'available');
    }

    public function scopeSettled($query)
    {
        return $query->where('earning_status', 'settled');
    }

    public function scopeRefunded($query)
    {
        return $query->where('earning_status', 'refunded');
    }

    public function scopeByVendor($query, int $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    public function scopeByDateRange($query, $from, $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }

    /**
     * Accessors
     */
    public function getFormattedNetEarningAttribute(): string
    {
        return '₺' . number_format($this->net_earning, 2, ',', '.');
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->earning_status) {
            'pending' => 'Beklemede',
            'available' => 'Çekilebilir',
            'settled' => 'Ödendi',
            'refunded' => 'İade Edildi',
            default => 'Bilinmiyor',
        };
    }

    /**
     * Static factory method to create earning from order item
     */
    public static function createFromOrderItem(OrderItem $orderItem): self
    {
        $vendor = $orderItem->vendor;
        $order = $orderItem->order;
        
        // Get commission rate from vendor's commission plan
        $commissionRate = $vendor->commissionPlan?->rate ?? config('app.default_commission_rate', 10);
        
        // Get withholding tax rate from config
        $withholdingTaxEnabled = config('finance.withholding_tax.enabled', true);
        $withholdingTaxRate = $withholdingTaxEnabled ? config('finance.withholding_tax.rate', 1.0) : 0;
        
        // Calculate price without tax (KDV)
        $taxRate = $orderItem->tax_rate ?? 0;
        $lineTotal = $orderItem->line_total;
        
        // Apply proportional coupon discount if exists
        $couponDiscount = 0;
        if ($order->coupon_discount > 0) {
            $orderSubtotal = $order->orderItems()->sum('line_total');
            $couponDiscount = ($lineTotal / $orderSubtotal) * $order->coupon_discount;
        }
        
        $priceAfterCoupon = $lineTotal - $couponDiscount;
        $grossAmount = $priceAfterCoupon / (1 + ($taxRate / 100));
        
        // Calculate deductions
        $commissionAmount = $grossAmount * ($commissionRate / 100);
        $withholdingTaxAmount = $grossAmount * ($withholdingTaxRate / 100);
        $netEarning = $grossAmount - $commissionAmount - $withholdingTaxAmount;
        
        // Create earning record
        return self::create([
            'vendor_id' => $vendor->id,
            'order_id' => $order->id,
            'order_item_id' => $orderItem->id,
            'gross_amount' => round($grossAmount, 2),
            'commission_rate' => $commissionRate,
            'commission_amount' => round($commissionAmount, 2),
            'withholding_tax_rate' => $withholdingTaxRate,
            'withholding_tax_amount' => round($withholdingTaxAmount, 2),
            'net_earning' => round($netEarning, 2),
            'earning_status' => 'pending',
            'available_at' => now()->addDays(config('finance.settlement.auto_available_after_days', 7)),
        ]);
    }

    /**
     * Mark earning as available for withdrawal
     */
    public function markAvailable(): bool
    {
        if ($this->earning_status !== 'pending') {
            return false;
        }

        return $this->update([
            'earning_status' => 'available',
            'available_at' => now(),
        ]);
    }

    /**
     * Mark earning as settled (paid out)
     */
    public function markSettled(int $payoutId): bool
    {
        if ($this->earning_status !== 'available') {
            return false;
        }

        return $this->update([
            'earning_status' => 'settled',
            'settled_at' => now(),
            'payout_id' => $payoutId,
        ]);
    }

    /**
     * Mark earning as refunded
     */
    public function markRefunded(): bool
    {
        return $this->update([
            'earning_status' => 'refunded',
        ]);
    }
}
