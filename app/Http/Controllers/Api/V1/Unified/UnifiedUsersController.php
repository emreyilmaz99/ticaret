<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Core\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Middleware\DetectUserType;
use Illuminate\Http\Request;

class UnifiedUsersController extends Controller
{
    public function __construct(
        protected AdminUserController $adminUserController
    ) {}

    /**
     * List all users (Admin only)
     * 
     * GET /api/v1/users
     */
    public function index(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can view users', 403);
        }

        return $this->adminUserController->index($request);
    }

    /**
     * Show single user (Admin only)
     * 
     * GET /api/v1/users/{user}
     */
    public function show(Request $request, string|int $user)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can view user details', 403);
        }

        return $this->adminUserController->show($user);
    }

    /**
     * Update user (Admin only)
     * 
     * PUT /api/v1/users/{user}
     */
    public function update(Request $request, string|int $user)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can update users', 403);
        }

        return $this->adminUserController->update($request, $user);
    }

    /**
     * Delete user (Admin only)
     * 
     * DELETE /api/v1/users/{user}
     */
    public function destroy(Request $request, string|int $user)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can delete users', 403);
        }

        return $this->adminUserController->destroy($user);
    }

    /**
     * Toggle user status (Admin only)
     * 
     * PUT /api/v1/users/{user}/toggle-status
     */
    public function toggleStatus(Request $request, string|int $user)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can toggle user status', 403);
        }

        return $this->adminUserController->toggleStatus($user);
    }

    /**
     * Get user orders (Admin only)
     * 
     * GET /api/v1/users/{user}/orders
     */
    public function getUserOrders(Request $request, string|int $user)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can view user orders', 403);
        }

        return $this->adminUserController->getUserOrders($user);
    }
}
