<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Admin\LoginRequest;
use App\Http\Resources\Api\V1\Admin\UserResource;
use App\Models\Vendor;
use App\Services\AuthService;

use Illuminate\Support\Facades\Hash;

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
        $user = request()->user();

        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)
           ->setStatusCode(200)
           ->setMessage('OK')
           ->setData([
               'user' => [
                   'id' => $user->id,
                   'name' => $user->name,
                   'email' => $user->email,
                   'roles' => $user->roles->pluck('name'),
                   'created_at' => $user->created_at?->toIso8601String(),
               ],
           ]);

        return $this->fromServiceResponse($sr);
    }

    public function logout(\Illuminate\Http\Request $request)
    {
        $user = $request->user();

        $sr = $this->authService->logout($user);

        return $this->fromServiceResponse($sr);
    }
}
