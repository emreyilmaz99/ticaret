<?php

namespace App\Services\Cart;

use App\Interfaces\Services\Cart\CartCouponManagerInterface;
use App\Core\ServiceResponse;
use App\Models\Cart;
use App\Models\User;
use App\Services\BaseService;
use App\Repositories\CartRepository;
use App\Repositories\VendorCouponRepository;

class CartCouponManager extends BaseService implements CartCouponManagerInterface
{
    protected CartRepository $cartRepo;
    protected VendorCouponRepository $couponRepo;
    protected CartResponseFormatter $formatter;

    public function __construct(
        CartRepository $cartRepo,
        VendorCouponRepository $couponRepo,
        CartResponseFormatter $formatter
    ) {
        $this->cartRepo = $cartRepo;
        $this->couponRepo = $couponRepo;
        $this->formatter = $formatter;
    }

    /**
     * Apply coupon to cart
     */
    public function applyCoupon(Cart $cart, string $code, ?User $user): ServiceResponse
    {
        try {
            $cart = $this->cartRepo->getWithItems($cart);
            $code = strtoupper($code);
            
            $coupon = $this->couponRepo->findActiveByCode($code);

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
            
            // Kuponu sepete kaydet
            $this->cartRepo->updateCoupon($cart, $code, $discount);
            
            // Sepeti yeniden yükle ve formatla
            $cart = $this->cartRepo->getWithItems($cart);
            
            return $this->successResponse(
                $this->formatter->format($cart),
                "{$code} kuponu uygulandı! {$discount} TL indirim kazandınız."
            );
            
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon uygulanamadı');
        }
    }

    /**
     * Validate coupon without applying
     */
    public function validateCoupon(string $code, float $subtotal, ?int $userId): array
    {
        $coupon = $this->couponRepo->findActiveByCode($code);

        if (!$coupon) {
            return ['valid' => false, 'message' => 'Geçersiz kupon kodu'];
        }

        return $coupon->isValidForUser($userId, $subtotal);
    }
}
