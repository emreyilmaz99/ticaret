<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Requests\Api\V1\Admin\LoginRequest;
use App\Services\Auth\AuthService;

class AdminAuthController extends BaseAdminController
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $sr = $this->authService->adminLogin($data);

        return $this->fromServiceResponse($sr);
    }

    public function me()
    {
        $user = request()->user();
        $user->loadMissing('roles');

        return $this->success(
            ['user' => new \App\Http\Resources\Api\V1\Admin\AdminResource($user)],
            'User retrieved'
        );
    }

    public function logout(\Illuminate\Http\Request $request)
    {
        $user = $request->user();

        $sr = $this->authService->logout($user);

        return $this->fromServiceResponse($sr);
    }
}
