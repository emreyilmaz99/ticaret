<?php

namespace App\Services\Order;

use App\Services\BaseService;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\VendorCoupon;
use Illuminate\Support\Facades\Log;

class CouponService extends BaseService
{
    /**
     * Sipariş için kupon kullanımını kaydet
     */
    public function recordUsageForOrder(Order $order): void
    {
        if (!$order->coupon_id) {
            return;
        }

        $coupon = VendorCoupon::find($order->coupon_id);
        if (!$coupon) {
            return;
        }

        // Kullanım kaydı oluştur
        CouponUsage::create([
            'coupon_id' => $coupon->id,
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'discount_applied' => $order->coupon_discount,
        ]);

        // Kupon kullanım sayısını artır
        $coupon->increment('usage_count');

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
        $coupon = VendorCoupon::where('code', strtoupper($code))
            ->where('is_active', true)
            ->first();

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
        return VendorCoupon::where('code', strtoupper($code))
            ->where('is_active', true)
            ->first();
    }
}
