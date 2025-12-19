<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Http\Controllers\Controller;
use App\Http\Middleware\DetectUserType;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Core\ApiResponse;

/**
 * UnifiedCategoriesController
 * 
 * Single controller that handles category operations for all user types.
 * - Admin: Full category management access
 * - Vendor: Read-only access
 * - User: Read-only access
 */
class UnifiedCategoriesController extends Controller
{
    protected AdminCategoryController $adminCategoryController;

    public function __construct(AdminCategoryController $adminCategoryController)
    {
        $this->adminCategoryController = $adminCategoryController;
    }

    /**
     * Get categories list
     * 
     * Works for: Admin, Vendor, User
     * Endpoint: GET /api/v1/categories
     */
    public function index(Request $request)
    {
        return $this->adminCategoryController->index($request);
    }

    /**
     * Get category statistics
     * 
     * Works for: Admin only
     * Endpoint: GET /api/v1/categories/statistics
     */
    public function statistics(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'admin' => $this->adminCategoryController->statistics($request),
            default => ApiResponse::error('Unauthorized access', 403),
        };
    }

    /**
     * Get category tree
     * 
     * Works for: Admin, Vendor, User
     * Endpoint: GET /api/v1/categories/tree
     */
    public function tree(Request $request)
    {
        return $this->adminCategoryController->tree($request);
    }

    /**
     * Show category details
     * 
     * Works for: Admin, Vendor, User
     * Endpoint: GET /api/v1/categories/{category}
     */
    public function show(Request $request, $category)
    {
        return $this->adminCategoryController->show($request, $category);
    }
}
