<?php

namespace App\Services\User;

use App\Interfaces\Services\User\UserProfileServiceInterface;
use App\Core\ServiceResponse;
use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Services\BaseService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserProfileService extends BaseService implements UserProfileServiceInterface
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepo
    ) {}

    /**
     * Get user profile
     */
    public function getProfile(User $user): ServiceResponse
    {
        try {
            $user->load('addresses');
            
            return $this->successResponse(['user' => $user], 'Profil getirildi');
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
            $this->userRepo->update($user, $data);

            return $this->successResponse(['user' => $user->fresh()], 'Profil bilgileri güncellendi');
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

            $this->userRepo->update($user, [
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

            $this->userRepo->update($user, [
                'avatar_path' => $path,
            ]);

            return $this->successResponse([
                'avatar_url' => $user->fresh()->avatar_url,
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

            $this->userRepo->update($user, [
                'avatar_path' => null,
            ]);

            return $this->successResponse(null, 'Avatar silindi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Avatar silinemedi');
        }
    }
}
