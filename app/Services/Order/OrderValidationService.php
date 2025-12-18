<?php

namespace App\Services\Order;

use App\Interfaces\Services\Order\OrderValidationServiceInterface;
use App\Services\BaseService;
use App\Models\Cart;

/**
 * OrderValidationService
 * 
 * Handles cart and order validation logic.
 */
class OrderValidationService extends BaseService implements OrderValidationServiceInterface
{
    /**
     * Validate cart before creating order
     */
    public function validateCart(Cart $cart)
    {
        $cart->load(['items.product.vendor', 'items.variant']);
        $errors = [];

        foreach ($cart->items as $item) {
            if (!$item->product) {
                $errors[] = "Ürün bulunamadı (ID: {$item->product_id})";
                continue;
            }

            if ($item->product->status !== 'active') {
                $errors[] = "{$item->product->name} artık satışta değil";
                continue;
            }

            $vendor = $item->product->vendor;
            if (!$vendor || !$vendor->canReceivePayments()) {
                $errors[] = "{$item->product->name} satıcısı şu anda ödeme alamıyor";
                continue;
            }

            if ($item->variant) {
                if (!$item->variant->hasStock($item->quantity)) {
                    $errors[] = "{$item->product->name} ({$item->variant->title}) için yeterli stok yok. Mevcut: {$item->variant->stock}";
                }
            }
        }

        if (!empty($errors)) {
            return $this->errorResponse(implode(', ', $errors), 400, ['errors' => $errors]);
        }

        return $this->successResponse(null, 'Sepet doğrulandı');
    }

    /**
     * Validate vendor can receive payments
     */
    public function validateVendorPaymentCapability($vendor): bool
    {
        return $vendor && $vendor->canReceivePayments();
    }

    /**
     * Validate product availability
     */
    public function validateProductAvailability($product): array
    {
        $errors = [];

        if (!$product) {
            $errors[] = "Ürün bulunamadı";
            return $errors;
        }

        if ($product->status !== 'active') {
            $errors[] = "{$product->name} artık satışta değil";
        }

        return $errors;
    }

    /**
     * Validate stock availability for variant
     */
    public function validateStock($variant, int $quantity): array
    {
        $errors = [];

        if ($variant && !$variant->hasStock($quantity)) {
            $errors[] = "Yeterli stok yok. Mevcut: {$variant->stock}";
        }

        return $errors;
    }
}
