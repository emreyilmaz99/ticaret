<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Traits\ResponseHttp;
use App\Services\Vendor\VendorBankAccountService;
use App\Http\Requests\Api\V1\Vendor\StoreVendorBankAccountRequest;
use App\Http\Resources\Api\V1\Vendor\VendorBankAccountResource;
use Illuminate\Http\Request;

class BankAccountController extends Controller
{
    use ResponseHttp;

    protected VendorBankAccountService $bankAccountService;

    public function __construct(VendorBankAccountService $bankAccountService)
    {
        $this->bankAccountService = $bankAccountService;
    }

    public function index(Request $request)
    {
        $vendorId = $request->user()->id;
        $accounts = $this->bankAccountService->list($vendorId);
        return $this->success(VendorBankAccountResource::collection($accounts));
    }

    public function store(StoreVendorBankAccountRequest $request)
    {
        $vendorId = $request->user()->id;
        $account = $this->bankAccountService->add($vendorId, $request->validated());
        return $this->success(new VendorBankAccountResource($account), 'Banka hesabı eklendi', 201);
    }

    public function update(StoreVendorBankAccountRequest $request, $accountId)
    {
        $vendorId = $request->user()->id;
        $account = $this->bankAccountService->update($vendorId, (int) $accountId, $request->validated());
        return $this->success(new VendorBankAccountResource($account), 'Banka hesabı güncellendi');
    }

    public function destroy(Request $request, $accountId)
    {
        $vendorId = $request->user()->id;
        $this->bankAccountService->delete($vendorId, (int) $accountId);
        return $this->success(null, 'Banka hesabı silindi');
    }
}
