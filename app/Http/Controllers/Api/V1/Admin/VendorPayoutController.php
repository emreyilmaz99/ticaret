<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Traits\ResponseHttp;
use App\Services\AdminService;
use App\Http\Requests\Admin\UpdatePayoutStatusRequest;
use Illuminate\Http\Request;

class VendorPayoutController extends Controller
{
    use ResponseHttp;

    protected AdminService $service;

    public function __construct(AdminService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $sr = $this->service->listVendorPayouts($perPage);
        return $this->fromServiceResponse($sr);
    }

    public function show($payoutId)
    {
        $sr = $this->service->findPayout((int) $payoutId);
        return $this->fromServiceResponse($sr);
    }

    public function update(UpdatePayoutStatusRequest $request, $payoutId)
    {
        $adminId = $request->user()->id;
        $status = $request->input('status');
        $sr = $this->service->updatePayoutStatus((int) $payoutId, $status, $adminId);
        return $this->fromServiceResponse($sr);
    }
}
