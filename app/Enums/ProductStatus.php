<?php

namespace App\Enums;

enum ProductStatus: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case REJECTED = 'rejected';
    case DRAFT = 'draft';
    case INACTIVE = 'inactive';
    case BANNED = 'banned';

    /**
     * Get the human-readable label for the status
     */
    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Onay Bekliyor',
            self::ACTIVE => 'Aktif',
            self::REJECTED => 'Reddedildi',
            self::DRAFT => 'Taslak',
            self::INACTIVE => 'Pasif',
            self::BANNED => 'Yasaklı',
        };
    }

    /**
     * Get the success message for status change
     */
    public function changeMessage(): string
    {
        return match($this) {
            self::PENDING => 'Ürün onay bekliyor durumuna alındı',
            self::ACTIVE => 'Ürün yayına alındı',
            self::REJECTED => 'Ürün reddedildi',
            self::DRAFT => 'Ürün taslak durumuna alındı',
            self::INACTIVE => 'Ürün pasife alındı',
            self::BANNED => 'Ürün yasaklandı',
        };
    }

    /**
     * Get message for a status string
     */
    public static function getChangeMessage(string $status): string
    {
        $enum = self::tryFrom($status);
        return $enum?->changeMessage() ?? 'Durum güncellendi';
    }

    /**
     * Check if the status requires rejection reason
     */
    public function requiresRejectionReason(): bool
    {
        return $this === self::REJECTED;
    }

    /**
     * Check if this status clears rejection data
     */
    public function clearsRejectionData(): bool
    {
        return $this === self::ACTIVE;
    }

    /**
     * Get all status values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
