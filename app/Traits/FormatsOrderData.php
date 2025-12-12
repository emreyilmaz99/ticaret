<?php

namespace App\Traits;

use App\Models\Order;

trait FormatsOrderData
{
    /**
     * Format address array for display
     */
    protected function formatAddress(?array $address): string
    {
        if (!$address) {
            return 'Adres bilgisi yok';
        }

        $parts = array_filter([
            $address['address'] ?? '',
            $address['district'] ?? '',
            $address['city'] ?? '',
            $address['country'] ?? 'Türkiye',
        ]);

        return implode(', ', $parts);
    }

    /**
     * Get payment method label from order
     */
    protected function getPaymentMethodLabel(Order $order): string
    {
        if (!empty($order->card_association)) {
            return 'Kredi Kartı';
        }

        return 'Havale/EFT';
    }

    /**
     * Get customer avatar URL
     */
    protected function getCustomerAvatar(string $name): string
    {
        return "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=random";
    }
}
