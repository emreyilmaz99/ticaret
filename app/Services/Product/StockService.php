<?php

namespace App\Services\Product;

use App\Interfaces\Services\Product\StockServiceInterface;
use App\Services\BaseService;
use App\Exceptions\InsufficientStockException;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Repositories\Interfaces\ProductVariantRepositoryInterface;
use App\Repositories\OrderRepository;
use Illuminate\Support\Facades\Log;

class StockService extends BaseService implements StockServiceInterface
{
    public function __construct(
        protected ProductVariantRepositoryInterface $variantRepo,
        protected OrderRepository $orderRepo
    ) {}

    /**
     * Sipariş için stokları düşür
     * @throws InsufficientStockException
     */
    public function decrementStocksForOrder(Order $order): void
    {
        $order = $this->orderRepo->loadWithItemsAndVariants($order);

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
        $order = $this->orderRepo->loadWithItemsAndVariants($order);

        foreach ($order->items as $item) {
            if ($item->variant) {
                $this->variantRepo->incrementStock($item->variant->id, $item->quantity);
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
        $success = $this->variantRepo->decrementStock($variant->id, $quantity);

        if (!$success) {
            // Fresh data ile güncel stoku al
            $currentStock = $this->variantRepo->getStock($variant->id);

            throw new InsufficientStockException(
                $productName ?? "Variant #{$variant->id}",
                $currentStock,
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
        return $this->variantRepo->incrementStock($variant->id, $quantity);
    }

    /**
     * Stok yeterliliğini kontrol et (exception fırlatmadan)
     */
    public function hasEnoughStock(ProductVariant $variant, int $quantity): bool
    {
        return $this->variantRepo->hasStock($variant->id, $quantity);
    }

    /**
     * Sipariş için stok yeterliliğini kontrol et
     * @return array Yetersiz stok olan ürünlerin listesi
     */
    public function validateStocksForOrder(Order $order): array
    {
        $order = $this->orderRepo->loadWithItemsAndVariants($order);
        $insufficientItems = [];

        foreach ($order->items as $item) {
            if ($item->variant && !$this->variantRepo->hasStock($item->variant->id, $item->quantity)) {
                $insufficientItems[] = [
                    'product_name' => $item->product_name,
                    'variant_title' => $item->variant_title,
                    'requested' => $item->quantity,
                    'available' => $this->variantRepo->getStock($item->variant->id),
                ];
            }
        }

        return $insufficientItems;
    }
}
