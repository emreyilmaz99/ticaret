<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Vendor\StoreCouponRequest;
use App\Http\Requests\Api\V1\Vendor\UpdateCouponRequest;
use App\Http\Resources\Api\V1\Vendor\CouponResource;
use App\Interfaces\Services\Vendor\VendorCouponServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected VendorCouponServiceInterface $couponService
    ) {}

    /**
     * Satıcının kuponlarını listele
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->couponService->getVendorCoupons($request->user()->id);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            CouponResource::collection($result->getData()),
            $result->getMessage()
        );
    }

    /**
     * Yeni kupon oluştur
     */
    public function store(StoreCouponRequest $request): JsonResponse
    {
        $result = $this->couponService->createCoupon(
            $request->user()->id,
            $request->validated()
        );

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            new CouponResource($result->getData()),
            $result->getMessage(),
            201
        );
    }

    /**
     * Kupon detayını göster
     */
    public function show(Request $request, int $coupon): JsonResponse
    {
        $result = $this->couponService->getCoupon($request->user()->id, $coupon);

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            new CouponResource($result->getData()),
            $result->getMessage()
        );
    }

    /**
     * Kuponu güncelle
     */
    public function update(UpdateCouponRequest $request, int $coupon): JsonResponse
    {
        $result = $this->couponService->updateCoupon(
            $request->user()->id,
            $coupon,
            $request->validated()
        );

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            new CouponResource($result->getData()),
            $result->getMessage()
        );
    }

    /**
     * Kuponu sil
     */
    public function destroy(Request $request, int $coupon): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->couponService->deleteCoupon($request->user()->id, $coupon)
        );
    }

    /**
     * Kupon durumunu değiştir (aktif/pasif)
     */
    public function toggle(Request $request, int $coupon): JsonResponse
    {
        $result = $this->couponService->toggleCoupon($request->user()->id, $coupon);

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            new CouponResource($result->getData()),
            $result->getMessage()
        );
    }
}
