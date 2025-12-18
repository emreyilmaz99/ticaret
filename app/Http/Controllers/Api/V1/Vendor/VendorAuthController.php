<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Admin\LoginRequest;
use App\Services\Auth\AuthService;

class VendorAuthController extends BaseVendorController
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $sr = $this->authService->vendorLogin($data);

        return $this->fromServiceResponse($sr);
    }

    public function me()
    {
        $vendor = request()->user();

        // Load relations that onboarding needs
        $vendor->loadMissing(['addresses', 'bankAccounts', 'roles']);

        return $this->success(
            ['vendor' => new \App\Http\Resources\Api\V1\Shared\VendorResource($vendor)],
            'Satıcı bilgileri başarıyla getirildi.'
        );
    }

    public function logout(\Illuminate\Http\Request $request)
    {
        $user = $request->user();

        $sr = $this->authService->logout($user);

        return $this->fromServiceResponse($sr);
    }
}
