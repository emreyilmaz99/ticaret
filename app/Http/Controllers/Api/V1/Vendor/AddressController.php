<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Traits\ResponseHttp;
use App\Services\Vendor\VendorAddressService;
use App\Http\Requests\Api\V1\Vendor\StoreVendorAddressRequest;
use App\Http\Resources\Api\V1\Vendor\VendorAddressResource;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    use ResponseHttp;

    protected VendorAddressService $addressService;

    public function __construct(VendorAddressService $addressService)
    {
        $this->addressService = $addressService;
    }

    public function index(Request $request)
    {
        $vendorId = $request->user()->id;
        $addresses = $this->addressService->list($vendorId);
        return $this->success(
            ['addresses' => VendorAddressResource::collection($addresses)],
            'Adresler başarıyla getirildi.'
        );
    }

    public function store(StoreVendorAddressRequest $request)
    {
        $vendorId = $request->user()->id;
        $address = $this->addressService->add($vendorId, $request->validated());
        return $this->success(
            ['address' => new VendorAddressResource($address)],
            'Adres başarıyla eklendi.',
            201
        );
    }

    public function update(StoreVendorAddressRequest $request, int $addressId)
    {
        $vendorId = $request->user()->id;
        $address = $this->addressService->update($vendorId, $addressId, $request->validated());
        return $this->success(
            ['address' => new VendorAddressResource($address)],
            'Adres başarıyla güncellendi.'
        );
    }

    public function destroy(Request $request, int $addressId)
    {
        $vendorId = $request->user()->id;
        $this->addressService->delete($vendorId, $addressId);
        return $this->success(null, 'Adres başarıyla silindi.');
    }
}
