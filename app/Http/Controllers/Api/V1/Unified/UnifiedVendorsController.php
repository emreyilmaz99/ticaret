<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Http\Controllers\Controller;
use App\Http\Middleware\DetectUserType;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\Admin\VendorController as AdminVendorController;
use App\Core\ApiResponse;

/**
 * UnifiedVendorsController
 * 
 * Single controller that handles vendor operations for all user types.
 * - Admin: Full vendor management access
 * - Vendor: Cannot access (403)
 * - User: Cannot access (403)
 */
class UnifiedVendorsController extends Controller
{
    protected AdminVendorController $adminVendorController;

    public function __construct(AdminVendorController $adminVendorController)
    {
        $this->adminVendorController = $adminVendorController;
    }

    /**
     * Get vendors list
     * 
     * Works for: Admin only
     * Endpoint: GET /api/v1/vendors
     */
    public function index(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'admin' => $this->adminVendorController->index($request),
            default => ApiResponse::error('Unauthorized access', 403),
        };
    }

    /**
     * Show vendor details
     * 
     * Works for: Admin only
     * Endpoint: GET /api/v1/vendors/{vendor}
     */
    public function show(Request $request, $vendor)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'admin' => $this->adminVendorController->show($request, $vendor),
            default => ApiResponse::error('Unauthorized access', 403),
        };
    }

    /**
     * Update vendor status
     * 
     * Works for: Admin only
     * Endpoint: PUT /api/v1/vendors/{vendor}/status
     */
    public function updateStatus(Request $request, $vendor)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'admin' => $this->adminVendorController->updateStatus($request, $vendor),
            default => ApiResponse::error('Unauthorized access', 403),
        };
    }

    /**
     * Update vendor
     * 
     * Works for: Admin only
     * Endpoint: PUT /api/v1/vendors/{vendor}
     */
    public function update(Request $request, $vendor)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'admin' => $this->adminVendorController->update($request, $vendor),
            default => ApiResponse::error('Unauthorized access', 403),
        };
    }

    /**
     * Delete vendor
     * 
     * Works for: Admin only
     * Endpoint: DELETE /api/v1/vendors/{vendor}
     */
    public function destroy(Request $request, $vendor)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'admin' => $this->adminVendorController->destroy($vendor),
            default => ApiResponse::error('Unauthorized access', 403),
        };
    }

    /**
     * Get vendor categories
     * 
     * Works for: Admin only
     * Endpoint: GET /api/v1/vendors/{vendor}/categories
     */
    public function getVendorCategories(Request $request, $vendor)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'admin' => $this->adminVendorController->getVendorCategories((int)$vendor),
            default => ApiResponse::error('Unauthorized access', 403),
        };
    }
}
