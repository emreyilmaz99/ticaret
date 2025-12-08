<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Traits\ResponseHttp;
use App\Services\Vendor\VendorPayoutService;
use App\Http\Requests\Api\V1\Vendor\RequestPayoutRequest;
use App\Http\Resources\Api\V1\Vendor\VendorPayoutResource;
use Illuminate\Http\Request;

class PayoutController extends Controller
{
    use ResponseHttp;

    protected VendorPayoutService $payoutService;

    public function __construct(VendorPayoutService $payoutService)
    {
        $this->payoutService = $payoutService;
    }

    public function index(Request $request)
    {
        $vendorId = $request->user()->id;
        $payouts = $this->payoutService->list($vendorId);
        return $this->success(VendorPayoutResource::collection($payouts));
    }

    public function store(RequestPayoutRequest $request)
    {
        $vendorId = $request->user()->id;
        $payout = $this->payoutService->request($vendorId, (float) $request->input('amount'), $request->validated());
        return $this->success(new VendorPayoutResource($payout), 'Payout isteği oluşturuldu', 201);
    }
}
