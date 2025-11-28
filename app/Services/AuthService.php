<?php

namespace App\Services;

use App\Core\ServiceResponse;
use App\Models\Admin;
use App\Models\Vendor;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function adminLogin(array $data): ServiceResponse
    {
        $admin = Admin::where('email', $data['email'])->first();

        if (! $admin || ! Hash::check($data['password'], $admin->password)) {
            return (new ServiceResponse())
                ->setSuccess(false)
                ->setStatusCode(401)
                ->setMessage('Invalid credentials')
                ->setData(null);
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

        return (new ServiceResponse())
            ->setSuccess(true)
            ->setStatusCode(200)
            ->setMessage('Logged in')
            ->setData($payload);
    }

    public function vendorLogin(array $data): ServiceResponse
    {
        $vendor = Vendor::where('email', $data['email'])->first();

        if (! $vendor || ! Hash::check($data['password'], $vendor->password)) {
            return (new ServiceResponse())
                ->setSuccess(false)
                ->setStatusCode(401)
                ->setMessage('Invalid credentials')
                ->setData(null);
        }

        // Allow vendors that are active or have a pre-approved application to login.
        // Other statuses should be rejected.
        if (property_exists($vendor, 'status') && ! in_array($vendor->status, [Vendor::STATUS_ACTIVE, Vendor::STATUS_PRE_APPROVED])) {
            return (new ServiceResponse())
                ->setSuccess(false)
                ->setStatusCode(403)
                ->setMessage('Vendor not active')
                ->setData(['status' => $vendor->status]);
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

        return (new ServiceResponse())
            ->setSuccess(true)
            ->setStatusCode(200)
            ->setMessage('Logged in')
            ->setData($payload);
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

        return (new ServiceResponse())
            ->setSuccess(true)
            ->setStatusCode(200)
            ->setMessage('Logged out')
            ->setData(null);
    }
}
