<?php

namespace App\Services\Order;

use App\Interfaces\Services\Order\CouponServiceInterface;
use App\Services\BaseService;
use App\Models\Order;
use App\Models\VendorCoupon;
use App\Repositories\VendorCouponRepository;
use App\Repositories\CouponUsageRepository;
use Illuminate\Support\Facades\Log;

class CouponService extends BaseService implements CouponServiceInterface
{
    public function __construct(
        protected VendorCouponRepository $vendorCouponRepository,
        protected CouponUsageRepository $couponUsageRepository
    ) {}

    /**
     * Sipariş için kupon kullanımını kaydet
     */
    public function recordUsageForOrder(Order $order): void
    {
        if (!$order->coupon_id) {
            return;
        }

        $coupon = $this->vendorCouponRepository->findById($order->coupon_id);
        if (!$coupon) {
            return;
        }

        // Kullanım kaydı oluştur
        $this->couponUsageRepository->create([
            'coupon_id' => $coupon->id,
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'discount_applied' => $order->coupon_discount,
        ]);

        // Kupon kullanım sayısını artır
        $this->vendorCouponRepository->incrementUsageCount($coupon->id);

        Log::info('Coupon usage recorded', [
            'coupon_id' => $coupon->id,
            'order_id' => $order->id,
            'discount' => $order->coupon_discount,
        ]);
    }

    /**
     * Kupon kodunu doğrula
     */
    public function validateCoupon(string $code, ?int $userId = null, float $subtotal = 0): array
    {
        $coupon = $this->vendorCouponRepository->findActiveByCode(strtoupper($code));

        if (!$coupon) {
            return [
                'valid' => false,
                'message' => 'Geçersiz kupon kodu',
            ];
        }

        return $coupon->isValidForUser($userId, $subtotal);
    }

    /**
     * Kupon indirimini hesapla
     */
    public function calculateDiscount(VendorCoupon $coupon, float $subtotal): float
    {
        return $coupon->calculateDiscount($subtotal);
    }

    /**
     * Kupon bilgilerini getir
     */
    public function getCouponByCode(string $code): ?VendorCoupon
    {
        return $this->vendorCouponRepository->findActiveByCode(strtoupper($code));
    }
}
