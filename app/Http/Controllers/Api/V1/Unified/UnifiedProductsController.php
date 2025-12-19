<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Http\Controllers\Controller;
use App\Http\Middleware\DetectUserType;
use App\Core\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Api\V1\Unified\StoreProductRequest;
use App\Http\Requests\Api\V1\Unified\UpdateProductRequest;
use App\Http\Requests\Api\V1\Unified\UpdateProductStatusRequest;
use App\Http\Requests\Api\V1\Unified\BulkUpdateProductStatusRequest;

class UnifiedProductsController extends Controller
{
    protected $vendorProductController;
    protected $adminProductController;

    public function __construct(
        \App\Http\Controllers\Api\V1\Vendor\ProductController $vendorProductController,
        \App\Http\Controllers\Api\V1\Admin\ProductController $adminProductController
    ) {
        $this->vendorProductController = $vendorProductController;
        $this->adminProductController = $adminProductController;
    }

    /**
     * List products
     * 
     * GET /api/v1/products
     * - Vendor: Gets their own products
     * - Admin: Gets all products
     * - User: Not available (use public endpoint)
     */
    public function index(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'vendor' => $this->vendorProductController->index($request),
            'admin' => $this->adminProductController->index($request),
            'user' => ApiResponse::error('Users should use public product endpoints', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Get product statistics (Admin only)
     * 
     * GET /api/v1/products/statistics
     */
    public function statistics(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can view product statistics', 403);
        }

        return $this->adminProductController->statistics(); // Doesn't need request
    }

    /**
     * Show single product
     * 
     * GET /api/v1/products/{id}
     */
    public function show(Request $request, int $id)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'vendor' => $this->vendorProductController->show($request, $id),
            'admin' => $this->adminProductController->show($id), // Only needs id
            'user' => ApiResponse::error('Users should use public product endpoints', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Create new product (Vendor only)
     * 
     * POST /api/v1/products
     * 
     * @param StoreProductRequest $request
     * @return mixed
     */
    public function store(StoreProductRequest $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'vendor') {
            return ApiResponse::error('Only vendors can create products', 403);
        }
        
        /** @phpstan-ignore-next-line */
        return $this->vendorProductController->store($request);
    }

    /**
     * Update product
     * 
     * PUT /api/v1/products/{id}
     * - Vendor: Can update their own products
     * - Admin: Can update any product
     * 
     * @param UpdateProductRequest $request
     * @param int $id
     * @return mixed
     */
    public function update(UpdateProductRequest $request, int $id)
    {
        $userType = DetectUserType::getUserType($request);
        
        /** @phpstan-ignore-next-line */
        return match($userType) {
            'vendor' => $this->vendorProductController->update($request, $id),
            'admin' => ApiResponse::error('Admin product update not implemented', 501),
            'user' => ApiResponse::error('Users cannot update products', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Update product status
     * 
     * PUT /api/v1/products/{id}/status
     * 
     * @param UpdateProductStatusRequest $request
     * @param int $id
     * @return mixed
     */
    public function updateStatus(UpdateProductStatusRequest $request, int $id)
    {
        $userType = DetectUserType::getUserType($request);
        
        /** @phpstan-ignore-next-line */
        return match($userType) {
            'vendor' => $this->vendorProductController->updateStatus($request, $id),
            'admin' => $this->adminProductController->updateStatus($request, $id),
            'user' => ApiResponse::error('Users cannot update product status', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Delete product
     * 
     * DELETE /api/v1/products/{id}
     */
    public function destroy(Request $request, int $id)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'vendor' => $this->vendorProductController->destroy($request, $id),
            'admin' => $this->adminProductController->destroy($id), // Only needs id
            'user' => ApiResponse::error('Users cannot delete products', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Delete product photo (Vendor only)
     * 
     * DELETE /api/v1/products/{product}/photos/{photo}
     */
    public function destroyPhoto(Request $request, int $product, int $photo)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'vendor') {
            return ApiResponse::error('Only vendors can delete product photos', 403);
        }

        return $this->vendorProductController->destroyPhoto($request, $product, $photo);
    }

    /**
     * Bulk update product status (Admin only)
     * 
     * POST /api/v1/products/bulk-status
     * 
     * @param BulkUpdateProductStatusRequest $request
     * @return mixed
     */
    public function bulkUpdateStatus(BulkUpdateProductStatusRequest $request)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can bulk update product status', 403);
        }
        
        /** @phpstan-ignore-next-line */
        return $this->adminProductController->bulkUpdateStatus($request);
    }
}
