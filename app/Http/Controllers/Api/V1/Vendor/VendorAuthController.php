<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Admin\LoginRequest;
use App\Http\Resources\Api\V1\Admin\UserResource;
use App\Models\Vendor;
use Illuminate\Support\Facades\Hash;

class VendorAuthController extends BaseVendorController
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $vendor = Vendor::where('email', $data['email'])->first();

        if (! $vendor || ! Hash::check($data['password'], $vendor->password)) {
            return $this->error('Invalid credentials', 401);
        }

        $token = $vendor->createToken('vendor-token', ['vendor:*'])->plainTextToken;

        return $this->success([
            'token' => $token,
            'vendor' => new UserResource($vendor->load('roles')),
        ], 'Logged in', 200);
    }

    public function me()
    {
        $user = request()->user();

        return $this->success(new UserResource($user->load('roles')));
    }

    public function logout(\Illuminate\Http\Request $request)
    {
        $user = $request->user();
        if ($user && method_exists($user, 'currentAccessToken')) {
            $token = $user->currentAccessToken();
            if ($token) {
                try {
                    if (method_exists($token, 'delete')) {
                        $token->delete();
                    }
                } catch (\Throwable $e) {
                    // ignore deletion error in environments where token model is not deletable
                }
            }
        }

        return $this->success(null, 'Logged out', 200);
    }
}
