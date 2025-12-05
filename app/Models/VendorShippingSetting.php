<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorShippingSetting extends Model
{
    use HasFactory;

    /**
     * Platform varsayılan değerleri
     */
    public const DEFAULT_SHIPPING_COST = 29.90;
    public const DEFAULT_FREE_SHIPPING_THRESHOLD = 300.00;

    protected $fillable = [
        'vendor_id',
        'shipping_cost',
        'free_shipping_threshold',
        'is_shipping_enabled',
    ];

    protected $casts = [
        'shipping_cost' => 'decimal:2',
        'free_shipping_threshold' => 'decimal:2',
        'is_shipping_enabled' => 'boolean',
    ];

    /**
     * Satıcı ilişkisi
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Verilen sepet alt toplamı için kargo ücretini hesapla
     * 
     * @param float $subtotal Sepet alt toplamı
     * @return float Kargo ücreti (0 ise ücretsiz)
     */
    public function calculateShippingCost(float $subtotal): float
    {
        // Kargo devre dışıysa ücretsiz
        if (!$this->is_shipping_enabled) {
            return 0;
        }

        // Ücretsiz kargo limitini geçtiyse ücretsiz
        if ($subtotal >= $this->free_shipping_threshold) {
            return 0;
        }

        return (float) $this->shipping_cost;
    }

    /**
     * Kargo durumu metni
     * 
     * @param float $subtotal Sepet alt toplamı
     * @return string
     */
    public function getShippingStatusText(float $subtotal): string
    {
        $cost = $this->calculateShippingCost($subtotal);
        
        if ($cost == 0) {
            return 'Ücretsiz Kargo';
        }
        
        return number_format($cost, 2) . ' ₺';
    }

    /**
     * Ücretsiz kargoya ne kadar kaldı
     * 
     * @param float $subtotal Sepet alt toplamı
     * @return float|null Kalan miktar, null ise zaten ücretsiz
     */
    public function getRemainingForFreeShipping(float $subtotal): ?float
    {
        if (!$this->is_shipping_enabled || $subtotal >= $this->free_shipping_threshold) {
            return null;
        }
        
        return $this->free_shipping_threshold - $subtotal;
    }

    /**
     * Varsayılan ayarları al veya oluştur
     * 
     * @param int $vendorId
     * @return self
     */
    public static function getOrCreateDefault(int $vendorId): self
    {
        return self::firstOrCreate(
            ['vendor_id' => $vendorId],
            [
                'shipping_cost' => self::DEFAULT_SHIPPING_COST,
                'free_shipping_threshold' => self::DEFAULT_FREE_SHIPPING_THRESHOLD,
                'is_shipping_enabled' => true,
            ]
        );
    }

    /**
     * Vendor için kargo ayarlarını al (yoksa varsayılan değerlerle yeni instance döndür)
     * Veritabanına kaydetmez, sadece hesaplama için kullanılır
     * 
     * @param int $vendorId
     * @return self
     */
    public static function getSettingsForVendor(int $vendorId): self
    {
        $settings = self::where('vendor_id', $vendorId)->first();
        
        if ($settings) {
            return $settings;
        }
        
        // Varsayılan değerlerle yeni instance (kaydetmeden)
        $default = new self();
        $default->vendor_id = $vendorId;
        $default->shipping_cost = self::DEFAULT_SHIPPING_COST;
        $default->free_shipping_threshold = self::DEFAULT_FREE_SHIPPING_THRESHOLD;
        $default->is_shipping_enabled = true;
        
        return $default;
    }
}
