<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Vendor\StoreCampaignRequest;
use App\Http\Requests\Api\V1\Vendor\UpdateCampaignRequest;
use App\Http\Resources\Api\V1\Vendor\CampaignResource;
use App\Services\Vendor\VendorCampaignService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected VendorCampaignService $campaignService
    ) {}

    /**
     * Satıcının kampanyalarını listele
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->campaignService->getVendorCampaigns($request->user()->id);
        
        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            CampaignResource::collection($result->getData()),
            $result->getMessage()
        );
    }

    /**
     * Yeni kampanya oluştur
     */
    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $result = $this->campaignService->createCampaign(
            $request->user()->id,
            $request->validated()
        );

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            new CampaignResource($result->getData()),
            $result->getMessage(),
            201
        );
    }

    /**
     * Kampanya detayını göster
     */
    public function show(Request $request, int $campaign): JsonResponse
    {
        $result = $this->campaignService->getCampaign($request->user()->id, $campaign);

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            new CampaignResource($result->getData()),
            $result->getMessage()
        );
    }

    /**
     * Kampanyayı güncelle
     */
    public function update(UpdateCampaignRequest $request, int $campaign): JsonResponse
    {
        $result = $this->campaignService->updateCampaign(
            $request->user()->id,
            $campaign,
            $request->validated()
        );

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            new CampaignResource($result->getData()),
            $result->getMessage()
        );
    }

    /**
     * Kampanyayı sil
     */
    public function destroy(Request $request, int $campaign): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->campaignService->deleteCampaign($request->user()->id, $campaign)
        );
    }

    /**
     * Kampanya durumunu değiştir (aktif/pasif)
     */
    public function toggle(Request $request, int $campaign): JsonResponse
    {
        $result = $this->campaignService->toggleCampaign($request->user()->id, $campaign);

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        return $this->success(
            new CampaignResource($result->getData()),
            $result->getMessage()
        );
    }
}
