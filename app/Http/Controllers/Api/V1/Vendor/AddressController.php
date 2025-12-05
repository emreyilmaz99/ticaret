<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Traits\ResponseHttp;
use App\Services\VendorService;
use App\Http\Requests\Api\V1\Vendor\StoreVendorAddressRequest;
use App\Http\Resources\Api\V1\Vendor\VendorAddressResource;
use Illuminate\Http\Request;

class AddressController extends Controller
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
        $addresses = $this->service->listAddresses($vendorId);
        return $this->success(VendorAddressResource::collection($addresses));
    }

    public function store(StoreVendorAddressRequest $request)
    {
        $vendorId = $request->user()->id;
        $address = $this->service->addAddress($vendorId, $request->validated());
        return $this->success(new VendorAddressResource($address), 'Adres eklendi', 201);
    }

    public function update(StoreVendorAddressRequest $request, $addressId)
    {
        $vendorId = $request->user()->id;
        $address = $this->service->updateAddress($vendorId, (int) $addressId, $request->validated());
        return $this->success(new VendorAddressResource($address), 'Adres güncellendi');
    }

    public function destroy(Request $request, $addressId)
    {
        $vendorId = $request->user()->id;
        $this->service->deleteAddress($vendorId, (int) $addressId);
        return $this->success(null, 'Adres silindi');
    }
}
