<?php

namespace App\Services\Auth;

use App\Interfaces\Services\Auth\AuthServiceInterface;
use App\Core\ServiceResponse;
use App\Models\Admin;
use App\Models\User;
use App\Models\Vendor;
use App\Services\BaseService;
use Illuminate\Support\Facades\Hash;

class AuthService extends BaseService implements AuthServiceInterface
{
    /**
     * User registration
     */
    public function userRegister(array $data): ServiceResponse
    {
        try {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'is_active' => true,
            ]);

            $token = $user->createToken('user-token', ['user:*'])->plainTextToken;

            $payload = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar_url,
                ],
                'token' => $token,
            ];

            return $this->successResponse($payload, 'Kayıt başarılı.', 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kayıt işlemi başarısız oldu');
        }
    }

    /**
     * User login
     */
    public function userLogin(array $data): ServiceResponse
    {
        try {
            $user = User::where('email', $data['email'])->first();

            if (!$user || !Hash::check($data['password'], $user->password)) {
                return $this->errorResponse('E-posta veya şifre hatalı.', 401);
            }

            if (!$user->is_active) {
                return $this->errorResponse('Hesabınız devre dışı bırakılmış.', 403);
            }

            // Update last login
            $user->update(['last_login_at' => now()]);

            $token = $user->createToken('user-token', ['user:*'])->plainTextToken;

            $payload = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar_url,
                    // @phpstan-ignore-next-line (cast to date, format() is available)
                    'birth_date' => $user->birth_date?->format('Y-m-d'),
                    'gender' => $user->gender,
                ],
                'token' => $token,
            ];

            return $this->successResponse($payload, 'Giriş başarılı.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Giriş işlemi başarısız oldu');
        }
    }

    /**
     * Get current user info
     */
    public function getCurrentUser(User $user): ServiceResponse
    {
        try {
            $user->load('addresses', 'defaultAddress');

            $payload = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'identity_number' => $user->identity_number,
                    'avatar' => $user->avatar_url,
                    // @phpstan-ignore-next-line (cast to date, format() is available)
                    'birth_date' => $user->birth_date?->format('Y-m-d'),
                    'gender' => $user->gender,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'addresses' => $user->addresses,
                    'default_address' => $user->defaultAddress,
                ],
            ];

            return $this->successResponse($payload);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kullanıcı bilgileri alınamadı');
        }
    }

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
        // First, try to find in vendors table
        $vendor = Vendor::where('email', $data['email'])->first();

        if ($vendor && Hash::check($data['password'], $vendor->password)) {
            // Check if vendor is banned
            if ($vendor->status === Vendor::STATUS_BANNED) {
                return $this->errorResponse('Hesabınız yasaklanmış. Destek ile iletişime geçin.', 403);
            }

            // Vendor account exists - allow login regardless of status
            // Frontend will handle application status flow
            $token = $vendor->createToken('vendor-token', ['vendor:*'])->plainTextToken;

            $payload = [
                'token' => $token,
                'vendor' => [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'email' => $vendor->email,
                    'company_name' => $vendor->company_name,
                    'status' => $vendor->status,
                    'status_label' => $vendor->status_label,
                    'iyzico_status' => $vendor->iyzico_status,
                    'iyzico_status_label' => $vendor->iyzico_status_label,
                    'onboarding_completed' => $vendor->onboarding_completed,
                    'needs_full_application' => $vendor->needsFullApplication(),
                    'is_awaiting_approval' => $vendor->isAwaitingFullApproval(),
                    'can_receive_payments' => $vendor->canReceivePayments(),
                    'latest_rejection_reason' => $vendor->latest_rejection_reason,
                    'roles' => $vendor->roles->pluck('name'),
                    'created_at' => $vendor->created_at?->toIso8601String(),
                ],
            ];

            return $this->successResponse($payload, 'Giriş başarılı');
        }

        // If not found in vendors, check vendor_applications
        $application = \App\Models\VendorApplication::where('email', $data['email'])
            ->where('type', 'pre_application')
            ->latest()
            ->first();

        if ($application && Hash::check($data['password'], $application->password)) {
            // Application exists but no vendor account yet
            $statusMessages = [
                'pending' => 'Ön başvurunuz admin onayı bekliyor',
                'approved' => 'Ön başvurunuz onaylandı. Lütfen giriş yapın.',
                'rejected' => 'Ön başvurunuz reddedildi. Sebep: ' . $application->rejection_reason,
            ];

            return $this->errorResponse(
                $statusMessages[$application->status] ?? 'Başvurunuz henüz işleme alınmadı',
                403,
                [
                    'is_application' => true,
                    'application_status' => $application->status,
                    'application_id' => $application->id,
                    'rejection_reason' => $application->rejection_reason,
                ]
            );
        }

        // Invalid credentials
        return $this->errorResponse('E-posta veya şifre hatalı', 401);
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
