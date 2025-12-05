<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\UpdateAvatarRequest;
use App\Http\Requests\Api\V1\User\UpdatePasswordRequest;
use App\Http\Requests\Api\V1\User\UpdateUserProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('addresses');

        return response()->json([
            'success' => true,
            'data' => [
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
            ],
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(UpdateUserProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Profil bilgileri güncellendi.',
            'data' => [
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
            ],
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mevcut şifre hatalı.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Şifre başarıyla güncellendi.',
        ]);
    }

    /**
     * Upload avatar for the user.
     */
    public function updateAvatar(UpdateAvatarRequest $request): JsonResponse
    {
        $user = $request->user();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Profil fotoğrafı güncellendi.',
            'data' => [
                'avatar' => $user->avatar_url,
            ],
        ]);
    }

    /**
     * Delete the user's avatar.
     */
    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->update(['avatar' => null]);

        return response()->json([
            'success' => true,
            'message' => 'Profil fotoğrafı silindi.',
        ]);
    }
}
