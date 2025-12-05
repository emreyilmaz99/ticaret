<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Traits\ResponseHttp;
use App\Services\VendorService;
use App\Http\Requests\Api\V1\Vendor\RequestPayoutRequest;
use App\Http\Resources\VendorPayoutResource;
use Illuminate\Http\Request;

class PayoutController extends Controller
{
    use ResponseHttp;

    protected VendorService $service;

    public function __construct(VendorService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $vendorId = $request->user()->id;
        $payouts = $this->service->listPayouts($vendorId);
        return $this->success(VendorPayoutResource::collection($payouts));
    }

    public function store(RequestPayoutRequest $request)
    {
        $vendorId = $request->user()->id;
        $payout = $this->service->requestPayout($vendorId, (float) $request->input('amount'), $request->validated());
        return $this->success(new VendorPayoutResource($payout), 'Payout isteği oluşturuldu', 201);
    }
}
