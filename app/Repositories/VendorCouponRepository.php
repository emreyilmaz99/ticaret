<?php

namespace App\Repositories;

use App\Models\VendorCoupon;

class VendorCouponRepository extends EloquentBaseRepository
{
    public function __construct(VendorCoupon $model)
    {
        parent::__construct($model);
    }

    /**
     * Find active coupon by code
     */
    public function findActiveByCode(string $code): ?VendorCoupon
    {
        return $this->model
            ->where('code', strtoupper($code))
            ->where('is_active', true)
            ->first();
    }

    /**
     * Find coupon by code for vendor
     */
    public function findByCodeForVendor(string $code, int $vendorId): ?VendorCoupon
    {
        return $this->model
            ->where('code', strtoupper($code))
            ->where('vendor_id', $vendorId)
            ->first();
    }

    /**
     * List coupons for vendor
     */
    public function listForVendor(int $vendorId, int $perPage = 15)
    {
        return $this->model
            ->where('vendor_id', $vendorId)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get active coupons for vendor
     */
    public function getActiveForVendor(int $vendorId)
    {
        return $this->model
            ->where('vendor_id', $vendorId)
            ->where('is_active', true)
            ->get();
    }

    /**
     * Find coupon by ID
     */
    public function findById(int $id): ?VendorCoupon
    {
        return $this->model->find($id);
    }

    /**
     * Increment usage count
     */
    public function incrementUsageCount(int $couponId): void
    {
        $this->model->where('id', $couponId)->increment('usage_count');
    }
}
