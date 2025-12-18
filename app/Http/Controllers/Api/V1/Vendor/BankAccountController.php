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
        return $this->success(
            ['accounts' => VendorBankAccountResource::collection($accounts)],
            'Banka hesapları başarıyla getirildi.'
        );
    }

    public function store(StoreVendorBankAccountRequest $request)
    {
        $vendorId = $request->user()->id;
        $account = $this->bankAccountService->add($vendorId, $request->validated());
        return $this->success(
            ['account' => new VendorBankAccountResource($account)],
            'Banka hesabı başarıyla eklendi.',
            201
        );
    }

    public function update(StoreVendorBankAccountRequest $request, int $accountId)
    {
        $vendorId = $request->user()->id;
        $account = $this->bankAccountService->update($vendorId, $accountId, $request->validated());
        return $this->success(
            ['account' => new VendorBankAccountResource($account)],
            'Banka hesabı başarıyla güncellendi.'
        );
    }

    public function destroy(Request $request, int $accountId)
    {
        $vendorId = $request->user()->id;
        $this->bankAccountService->delete($vendorId, $accountId);
        return $this->success(null, 'Banka hesabı başarıyla silindi.');
    }
}
