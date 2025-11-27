<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Requests\Api\V1\Admin\LoginRequest;
use App\Http\Resources\Api\V1\Admin\UserResource;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends BaseAdminController
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $admin = Admin::where('email', $data['email'])->first();

        if (! $admin || ! Hash::check($data['password'], $admin->password)) {
            return $this->error('Invalid credentials', 401);
        }

        $token = $admin->createToken('admin-token', ['admin:*'])->plainTextToken;

        return $this->success([
            'token' => $token,
            'admin' => new UserResource($admin->load('roles')),
        ], 'Logged in', 200);
    }

    public function me()
    {
        $user = request()->user();

        if ($user instanceof \App\Models\Admin) {
            return $this->success(new UserResource($user->load('roles')));
        }

        // fallback: if user model hasRole admin
        return $this->success(new UserResource($user->load('roles')));
    }
}
