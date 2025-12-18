<?php

namespace App\Interfaces\Services\User;

use App\Core\ServiceResponse;
use App\Models\User;

interface UserProfileServiceInterface
{
    /**
     * Get user profile
     */
    public function getProfile(User $user): ServiceResponse;

    /**
     * Update user profile
     */
    public function updateProfile(User $user, array $data): ServiceResponse;

    /**
     * Update user password
     */
    public function updatePassword(User $user, string $currentPassword, string $newPassword): ServiceResponse;

    /**
     * Update user avatar
     */
    public function updateAvatar(User $user, $avatarFile): ServiceResponse;

    /**
     * Delete user avatar
     */
    public function deleteAvatar(User $user): ServiceResponse;
}
