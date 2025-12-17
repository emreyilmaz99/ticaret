<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\UpdateAvatarRequest;
use App\Http\Requests\Api\V1\User\UpdatePasswordRequest;
use App\Http\Requests\Api\V1\User\UpdateUserProfileRequest;
use App\Services\User\UserProfileService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected UserProfileService $profileService
    ) {}

    /**
     * Get the authenticated user's profile.
     */
    public function show(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->profileService->getProfile($request->user())
        );
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(UpdateUserProfileRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->profileService->updateProfile($request->user(), $request->validated())
        );
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        return $this->fromServiceResponse(
            $this->profileService->updatePassword(
                $request->user(),
                $validated['current_password'],
                $validated['password']
            )
        );
    }

    /**
     * Upload avatar for the user.
     */
    public function updateAvatar(UpdateAvatarRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->profileService->updateAvatar($request->user(), $request->file('avatar'))
        );
    }

    /**
     * Delete the user's avatar.
     */
    public function deleteAvatar(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->profileService->deleteAvatar($request->user())
        );
    }
}
