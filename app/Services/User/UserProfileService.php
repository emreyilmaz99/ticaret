<?php

namespace App\Services\User;

use App\Core\ServiceResponse;
use App\Models\User;
use App\Services\BaseService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserProfileService extends BaseService
{
    /**
     * Get user profile
     */
    public function getProfile(User $user): ServiceResponse
    {
        try {
            $user->load('addresses');

            $profile = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'identity_number' => $user->identity_number,
                    'avatar' => $user->avatar_url,
                    'birth_date' => $user->birth_date?->format('Y-m-d'),
                    'gender' => $user->gender,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'addresses' => $user->addresses,
                ],
            ];

            return $this->successResponse($profile, 'Profil getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Profil alınamadı');
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(User $user, array $data): ServiceResponse
    {
        try {
            $user->update($data);

            $profile = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'identity_number' => $user->identity_number,
                    'avatar' => $user->avatar_url,
                    'birth_date' => $user->birth_date?->format('Y-m-d'),
                    'gender' => $user->gender,
                ],
            ];

            return $this->successResponse($profile, 'Profil bilgileri güncellendi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Profil güncellenemedi');
        }
    }

    /**
     * Update user password
     */
    public function updatePassword(User $user, string $currentPassword, string $newPassword): ServiceResponse
    {
        try {
            if (!Hash::check($currentPassword, $user->password)) {
                return $this->errorResponse('Mevcut şifre hatalı', 422);
            }

            $user->update([
                'password' => Hash::make($newPassword),
            ]);

            return $this->successResponse(null, 'Şifre başarıyla güncellendi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Şifre güncellenemedi');
        }
    }

    /**
     * Upload user avatar
     */
    public function updateAvatar(User $user, $avatarFile): ServiceResponse
    {
        try {
            // Delete old avatar if exists
            if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            // Store new avatar
            $path = $avatarFile->store('avatars', 'public');

            $user->update([
                'avatar_path' => $path,
            ]);

            return $this->successResponse([
                'avatar_url' => $user->avatar_url,
            ], 'Avatar güncellendi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Avatar güncellenemedi');
        }
    }

    /**
     * Delete user avatar
     */
    public function deleteAvatar(User $user): ServiceResponse
    {
        try {
            if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            $user->update([
                'avatar_path' => null,
            ]);

            return $this->successResponse(null, 'Avatar silindi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Avatar silinemedi');
        }
    }
}
