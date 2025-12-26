<?php

namespace App\Repositories;

use App\Models\CouponUsage;

class CouponUsageRepository extends EloquentBaseRepository
{
    public function __construct(CouponUsage $model)
    {
        parent::__construct($model);
    }

    /**
     * Create coupon usage record
     */
    public function create(array $data): CouponUsage
    {
        return $this->model->create($data);
    }

    /**
     * Check if user has used coupon
     */
    public function hasUserUsedCoupon(int $userId, int $couponId): bool
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('coupon_id', $couponId)
            ->exists();
    }

    /**
     * Count usage for coupon
     */
    public function countForCoupon(int $couponId): int
    {
        return $this->model->where('coupon_id', $couponId)->count();
    }

    /**
     * Count user usage for coupon
     */
    public function countUserUsageForCoupon(int $userId, int $couponId): int
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('coupon_id', $couponId)
            ->count();
    }
}
