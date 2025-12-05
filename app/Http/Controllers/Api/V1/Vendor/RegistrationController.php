<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Traits\ResponseHttp;
use App\Http\Requests\Api\V1\Vendor\RegisterVendorRequest;
use App\Services\VendorService;
use App\Http\Resources\VendorResource;

class RegistrationController extends Controller
{
    use ResponseHttp;

    protected VendorService $service;

    public function __construct(VendorService $service)
    {
        $this->service = $service;
    }

    public function store(RegisterVendorRequest $request)
    {
        $data = $request->validated();
        // New vendors start as inactive until admin approval
        $data['status'] = \App\Models\Vendor::STATUS_INACTIVE;

        // password mutator will hash
        $vendor = $this->service->create($data);

        return $this->success(new VendorResource($vendor), 'Kayıt alındı. Admin onayı bekleniyor.', 201);
    }
}
