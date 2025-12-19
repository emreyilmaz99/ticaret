<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Core\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Middleware\DetectUserType;
use Illuminate\Http\Request;

class UnifiedAdminsController extends Controller
{
    public function __construct(
        protected AdminController $adminController
    ) {}

    /**
     * List all admins (Admin only - super-admin preferred)
     * 
     * GET /api/v1/admins
     */
    public function index(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can view admin list', 403);
        }

        return $this->adminController->index($request);
    }

    /**
     * Show single admin (Admin only)
     * 
     * GET /api/v1/admins/{admin}
     */
    public function show(Request $request, string|int $admin)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can view admin details', 403);
        }

        return $this->adminController->show((int)$admin);
    }

    /**
     * Create new admin (Admin only - super-admin)
     * 
     * POST /api/v1/admins
     */
    public function store(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can create admins', 403);
        }

        // Note: The actual super-admin check is done via middleware in admin routes
        return $this->adminController->store($request);
    }

    /**
     * Update admin (Admin only)
     * 
     * PUT /api/v1/admins/{admin}
     */
    public function update(Request $request, string|int $admin)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can update admins', 403);
        }

        return $this->adminController->update($request, (int)$admin);
    }

    /**
     * Delete admin (Admin only - super-admin)
     * 
     * DELETE /api/v1/admins/{admin}
     */
    public function destroy(Request $request, string|int $admin)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can delete admins', 403);
        }

        return $this->adminController->destroy((int)$admin);
    }
}
