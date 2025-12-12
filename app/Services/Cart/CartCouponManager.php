<?php

namespace App\Services\Cart;

use App\Core\ServiceResponse;
use App\Models\Cart;
use App\Models\User;
use App\Models\VendorCoupon;
use App\Services\BaseService;

class CartCouponManager extends BaseService
{
    /**
     * Apply coupon to cart
     */
    public function applyCoupon(Cart $cart, string $code, ?User $user): ServiceResponse
    {
        try {
            $cart->load('items.product');
            $code = strtoupper($code);
            
            $coupon = VendorCoupon::where('code', $code)
                ->where('is_active', true)
                ->first();

            if (!$coupon) {
                return $this->errorResponse('Geçersiz kupon kodu', 400);
            }

            // Kuponun satıcısının ürünlerini sepette bul
            $vendorItems = $cart->items->filter(fn($item) => $item->product->vendor_id === $coupon->vendor_id);
            
            if ($vendorItems->isEmpty()) {
                return $this->errorResponse('Bu kupon sepetinizdeki ürünler için geçerli değil', 400);
            }

            $vendorSubtotal = $vendorItems->sum(fn($item) => $item->unit_price * $item->quantity);

            // Kupon geçerlilik kontrolü
            $userId = $user ? $user->id : null;
            $validation = $coupon->isValidForUser($userId, $vendorSubtotal);
            
            if (!$validation['valid']) {
                return $this->errorResponse($validation['message'], 400);
            }

            // İndirim hesapla
            $discount = $coupon->calculateDiscount($vendorSubtotal);
            
            return $this->successResponse([
                'code' => $code,
                'discount' => $discount,
            ], "{$code} kuponu uygulandı! {$discount} TL indirim kazandınız.");
            
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon uygulanamadı');
        }
    }

    /**
     * Validate coupon without applying
     */
    public function validateCoupon(string $code, float $subtotal, ?int $userId): array
    {
        $coupon = VendorCoupon::where('code', $code)
            ->where('is_active', true)
            ->first();

        if (!$coupon) {
            return ['valid' => false, 'message' => 'Geçersiz kupon kodu'];
        }

        return $coupon->isValidForUser($userId, $subtotal);
    }
}
