<?php

namespace App\Services\Vendor;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Vendor\VendorCouponServiceInterface;
use App\Models\VendorCoupon;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;

class VendorCouponService extends BaseService implements VendorCouponServiceInterface
{
    /**
     * Get vendor's coupons
     */
    public function getVendorCoupons(int $vendorId): ServiceResponse
    {
        try {
            $coupons = VendorCoupon::where('vendor_id', $vendorId)
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->successResponse($coupons, 'Kuponlar başarıyla getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kuponlar getirilemedi');
        }
    }

    /**
     * Create new coupon
     */
    public function createCoupon(int $vendorId, array $data): ServiceResponse
    {
        try {
            // Check code uniqueness for this vendor
            $exists = VendorCoupon::where('vendor_id', $vendorId)
                ->where('code', strtoupper($data['code']))
                ->exists();

            if ($exists) {
                return $this->errorResponse('Bu kupon kodu zaten kullanılıyor', 422);
            }

            $coupon = VendorCoupon::create([
                'vendor_id' => $vendorId,
                'code' => strtoupper($data['code']),
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'discount_amount' => $data['discount_amount'],
                'min_order_amount' => $data['min_order_amount'] ?? 0,
                'usage_limit' => $data['usage_limit'] ?? null,
                'usage_limit_per_user' => $data['usage_limit_per_user'] ?? null,
                'starts_at' => $data['starts_at'] ?? null,
                'expires_at' => $data['expires_at'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            return $this->successResponse($coupon, 'Kupon başarıyla oluşturuldu', 201);

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon oluşturulamadı');
        }
    }

    /**
     * Get single coupon
     */
    public function getCoupon(int $vendorId, int $couponId): ServiceResponse
    {
        try {
            $coupon = VendorCoupon::where('id', $couponId)
                ->where('vendor_id', $vendorId)
                ->first();

            if (!$coupon) {
                return $this->errorResponse('Kupon bulunamadı veya erişim yetkiniz yok', 404);
            }

            return $this->successResponse($coupon, 'Kupon detayı getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon getirilemedi');
        }
    }

    /**
     * Update coupon
     */
    public function updateCoupon(int $vendorId, int $couponId, array $data): ServiceResponse
    {
        try {
            $coupon = VendorCoupon::where('id', $couponId)
                ->where('vendor_id', $vendorId)
                ->first();

            if (!$coupon) {
                return $this->errorResponse('Kupon bulunamadı veya erişim yetkiniz yok', 404);
            }

            // Check code uniqueness if code is being updated
            if (isset($data['code'])) {
                $exists = VendorCoupon::where('vendor_id', $vendorId)
                    ->where('code', strtoupper($data['code']))
                    ->where('id', '!=', $couponId)
                    ->exists();

                if ($exists) {
                    return $this->errorResponse('Bu kupon kodu zaten kullanılıyor', 422);
                }

                $data['code'] = strtoupper($data['code']);
            }

            $coupon->update($data);

            return $this->successResponse($coupon->fresh(), 'Kupon başarıyla güncellendi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon güncellenemedi');
        }
    }

    /**
     * Delete coupon
     */
    public function deleteCoupon(int $vendorId, int $couponId): ServiceResponse
    {
        try {
            $coupon = VendorCoupon::where('id', $couponId)
                ->where('vendor_id', $vendorId)
                ->first();

            if (!$coupon) {
                return $this->errorResponse('Kupon bulunamadı veya erişim yetkiniz yok', 404);
            }

            $coupon->delete();

            return $this->successResponse(null, 'Kupon başarıyla silindi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon silinemedi');
        }
    }

    /**
     * Toggle coupon active status
     */
    public function toggleCoupon(int $vendorId, int $couponId): ServiceResponse
    {
        try {
            $coupon = VendorCoupon::where('id', $couponId)
                ->where('vendor_id', $vendorId)
                ->first();

            if (!$coupon) {
                return $this->errorResponse('Kupon bulunamadı veya erişim yetkiniz yok', 404);
            }

            $newStatus = !$coupon->is_active;
            $coupon->update(['is_active' => $newStatus]);

            $message = $newStatus ? 'Kupon aktifleştirildi' : 'Kupon devre dışı bırakıldı';

            return $this->successResponse($coupon->fresh(), $message);

        } catch (\Exception $e) {
            return $this->handleException($e, 'Kupon durumu değiştirilemedi');
        }
    }
}
