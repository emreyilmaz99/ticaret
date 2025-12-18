<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;

interface VendorCouponServiceInterface
{
    public function getVendorCoupons(int $vendorId): ServiceResponse;
    public function createCoupon(int $vendorId, array $data): ServiceResponse;
    public function getCoupon(int $vendorId, int $couponId): ServiceResponse;
    public function updateCoupon(int $vendorId, int $couponId, array $data): ServiceResponse;
    public function deleteCoupon(int $vendorId, int $couponId): ServiceResponse;
    public function toggleCoupon(int $vendorId, int $couponId): ServiceResponse;
}
