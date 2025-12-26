<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'pending';           // Ödeme Bekleniyor
    case PROCESSING = 'processing';     // Ödeme İşleniyor
    case PAID = 'paid';                 // Ödendi
    case FAILED = 'failed';             // Ödeme Başarısız
    case REFUNDED = 'refunded';         // İade Edildi (para iadesi)

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Ödeme Bekleniyor',
            self::PROCESSING => 'Ödeme İşleniyor',
            self::PAID => 'Ödendi',
            self::FAILED => 'Ödeme Başarısız',
            self::REFUNDED => 'İade Edildi',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'yellow',
            self::PROCESSING => 'blue',
            self::PAID => 'green',
            self::FAILED => 'red',
            self::REFUNDED => 'orange',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
