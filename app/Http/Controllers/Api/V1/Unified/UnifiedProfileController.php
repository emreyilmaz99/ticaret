<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Http\Controllers\Controller;
use App\Http\Middleware\DetectUserType;
use Illuminate\Http\Request;
use App\Http\Requests\Api\V1\Unified\UpdateProfileRequest;
use App\Interfaces\Services\User\UserServiceInterface;
use App\Interfaces\Services\Vendor\VendorServiceInterface;
use App\Interfaces\Services\Admin\AdminServiceInterface;
use App\Core\ApiResponse;

/**
 * UnifiedProfileController
 * 
 * Single controller that handles profile operations for all user types.
 * Automatically routes to appropriate service based on authenticated user type.
 */
class UnifiedProfileController extends Controller
{
    protected UserServiceInterface $userService;
    protected VendorServiceInterface $vendorService;
    protected AdminServiceInterface $adminService;

    public function __construct(
        UserServiceInterface $userService,
        VendorServiceInterface $vendorService,
        AdminServiceInterface $adminService
    ) {
        $this->userService = $userService;
        $this->vendorService = $vendorService;
        $this->adminService = $adminService;
    }

    /**
     * Get authenticated user's profile
     * 
     * Works for: User, Vendor, Admin
     * Endpoint: GET /api/v1/me
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $userType = DetectUserType::getUserType($request);

        $result = match($userType) {
            'user' => $this->userService->getCurrentUser($user),
            'vendor' => $this->vendorService->getCurrentVendor($user),
            'admin' => $this->adminService->getCurrentAdmin($user),
            default => null,
        };

        if (!$result) {
            return ApiResponse::error('Unknown user type', 400);
        }

        // AdminService returns ServiceResponse, User/Vendor return model
        if ($result instanceof \App\Core\ServiceResponse) {
            return ApiResponse::success($result->getData());
        }

        // Transform User model to UserProfileResource
        if ($userType === 'user' && $result instanceof \App\Models\User) {
            return ApiResponse::success(new \App\Http\Resources\Api\V1\User\UserProfileResource($result));
        }

        return ApiResponse::success($result);
    }

    /**
     * Update authenticated user's profile
     * 
     * Works for: User, Vendor, Admin
     * Endpoint: PUT /api/v1/profile
     */
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $userType = DetectUserType::getUserType($request);
        $validated = $request->validated();

        $result = match($userType) {
            'user' => $this->userService->update($user->id, $validated),
            'vendor' => $this->vendorService->update($user->id, $validated),
            'admin' => $this->adminService->update($user->id, $validated),
            default => null,
        };

        if (!$result) {
            return ApiResponse::error('Unknown user type', 400);
        }

        // AdminService returns ServiceResponse, User/Vendor return model
        if ($result instanceof \App\Core\ServiceResponse) {
            return ApiResponse::success($result->getData(), 'Profile updated successfully');
        }

        return ApiResponse::success($result, 'Profile updated successfully');
    }
}
