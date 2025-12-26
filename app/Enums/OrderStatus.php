<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';           // Beklemede (ödeme bekleniyor)
    case CONFIRMED = 'confirmed';       // Onaylandı (ödeme alındı, hazırlanmayı bekliyor)
    case PROCESSING = 'processing';     // Hazırlanıyor
    case SHIPPED = 'shipped';           // Kargoya Verildi
    case DELIVERED = 'delivered';       // Teslim Edildi
    case COMPLETED = 'completed';       // Tamamlandı
    case CANCELLED = 'cancelled';       // İptal Edildi
    case RETURNED = 'returned';         // İade Edildi

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Beklemede',
            self::CONFIRMED => 'Onaylandı',
            self::PROCESSING => 'Hazırlanıyor',
            self::SHIPPED => 'Kargoya Verildi',
            self::DELIVERED => 'Teslim Edildi',
            self::COMPLETED => 'Tamamlandı',
            self::CANCELLED => 'İptal Edildi',
            self::RETURNED => 'İade Edildi',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'yellow',
            self::CONFIRMED => 'blue',
            self::PROCESSING => 'indigo',
            self::SHIPPED => 'purple',
            self::DELIVERED => 'green',
            self::COMPLETED => 'green',
            self::CANCELLED => 'red',
            self::RETURNED => 'orange',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
