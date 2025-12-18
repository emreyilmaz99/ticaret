<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Vendor\UpdateShippingSettingRequest;
use App\Services\Vendor\VendorShippingSettingService;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShippingSettingController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected VendorShippingSettingService $shippingSettingService
    ) {}

    /**
     * Satıcının kargo ayarlarını getir
     */
    public function show(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->shippingSettingService->getSettings($request->user()->id)
        );
    }

    /**
     * Satıcının kargo ayarlarını güncelle
     */
    public function update(UpdateShippingSettingRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->shippingSettingService->updateSettings(
                $request->user()->id,
                $request->validated()
            )
        );
    }
}
