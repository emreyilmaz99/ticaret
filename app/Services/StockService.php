<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Log;

class StockService extends BaseService
{
    /**
     * Sipariş için stokları düşür
     * @throws InsufficientStockException
     */
    public function decrementStocksForOrder(Order $order): void
    {
        $order->load('items.variant');

        foreach ($order->items as $item) {
            if ($item->variant) {
                $this->decrementStock(
                    $item->variant,
                    $item->quantity,
                    $item->product_name . ($item->variant_title ? " - {$item->variant_title}" : '')
                );
            }
        }

        Log::info('Stocks decremented for order', [
            'order_id' => $order->id,
            'item_count' => $order->items->count(),
        ]);
    }

    /**
     * Sipariş iptali için stokları geri yükle
     */
    public function restoreStocksForOrder(Order $order): void
    {
        $order->load('items.variant');

        foreach ($order->items as $item) {
            if ($item->variant) {
                $item->variant->incrementStock($item->quantity);
            }
        }

        Log::info('Stocks restored for cancelled order', [
            'order_id' => $order->id,
            'item_count' => $order->items->count(),
        ]);
    }

    /**
     * Tek bir varyant için stok düşür
     * @throws InsufficientStockException
     */
    public function decrementStock(ProductVariant $variant, int $quantity, ?string $productName = null): bool
    {
        $success = $variant->decrementStock($quantity);

        if (!$success) {
            // Fresh data ile güncel stoku al
            $variant->refresh();

            throw new InsufficientStockException(
                $productName ?? "Variant #{$variant->id}",
                $variant->stock,
                $quantity
            );
        }

        return true;
    }

    /**
     * Tek bir varyant için stok artır
     */
    public function incrementStock(ProductVariant $variant, int $quantity): bool
    {
        return $variant->incrementStock($quantity);
    }

    /**
     * Stok yeterliliğini kontrol et (exception fırlatmadan)
     */
    public function hasEnoughStock(ProductVariant $variant, int $quantity): bool
    {
        return $variant->hasStock($quantity);
    }

    /**
     * Sipariş için stok yeterliliğini kontrol et
     * @return array Yetersiz stok olan ürünlerin listesi
     */
    public function validateStocksForOrder(Order $order): array
    {
        $order->load('items.variant');
        $insufficientItems = [];

        foreach ($order->items as $item) {
            if ($item->variant && !$item->variant->hasStock($item->quantity)) {
                $insufficientItems[] = [
                    'product_name' => $item->product_name,
                    'variant_title' => $item->variant_title,
                    'requested' => $item->quantity,
                    'available' => $item->variant->stock,
                ];
            }
        }

        return $insufficientItems;
    }
}
