<?php

namespace App\Services;

use App\Core\ServiceResponse;
use App\Models\Admin;
use App\Models\Vendor;
use Illuminate\Support\Facades\Hash;

class AuthService extends BaseService
{
    public function adminLogin(array $data): ServiceResponse
    {
        $admin = Admin::where('email', $data['email'])->first();

        if (!$admin || !Hash::check($data['password'], $admin->password)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        $token = $admin->createToken('admin-token', ['admin:*'])->plainTextToken;

        $payload = [
            'token' => $token,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'roles' => $admin->roles->pluck('name'),
                'created_at' => $admin->created_at?->toIso8601String(),
            ],
        ];

        return $this->successResponse($payload, 'Logged in');
    }

    public function vendorLogin(array $data): ServiceResponse
    {
        $vendor = Vendor::where('email', $data['email'])->first();

        if (!$vendor || !Hash::check($data['password'], $vendor->password)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        // Allow vendors that are active or have a pre-approved application to login.
        // Other statuses should be rejected.
        if (property_exists($vendor, 'status') && !in_array($vendor->status, [Vendor::STATUS_ACTIVE, Vendor::STATUS_PRE_APPROVED])) {
            return $this->errorResponse('Vendor not active', 403, ['status' => $vendor->status]);
        }

        $token = $vendor->createToken('vendor-token', ['vendor:*'])->plainTextToken;

        $payload = [
            'token' => $token,
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'email' => $vendor->email,
                'roles' => $vendor->roles->pluck('name'),
                'created_at' => $vendor->created_at?->toIso8601String(),
            ],
        ];

        return $this->successResponse($payload, 'Logged in');
    }

    public function logout($user): ServiceResponse
    {
        if ($user && method_exists($user, 'currentAccessToken')) {
            $token = $user->currentAccessToken();
            if ($token && method_exists($token, 'delete')) {
                try {
                    $token->delete();
                } catch (\Throwable $e) {
                    // ignore
                }
            }
        }

        return $this->successResponse(null, 'Logged out');
    }
}
