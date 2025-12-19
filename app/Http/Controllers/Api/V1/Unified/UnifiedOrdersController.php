<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Http\Controllers\Controller;
use App\Http\Middleware\DetectUserType;
use App\Core\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Api\V1\Unified\UpdateOrderStatusRequest;
use App\Http\Requests\Api\V1\Unified\CancelOrderRequest;
use App\Http\Requests\Api\V1\Unified\AddOrderNoteRequest;

class UnifiedOrdersController extends Controller
{
    protected $userOrderController;
    protected $vendorOrderController;
    protected $adminOrderController;

    public function __construct(
        \App\Http\Controllers\Api\V1\User\OrderController $userOrderController,
        \App\Http\Controllers\Api\V1\Vendor\OrderController $vendorOrderController,
        \App\Http\Controllers\Api\V1\Admin\OrderController $adminOrderController
    ) {
        $this->userOrderController = $userOrderController;
        $this->vendorOrderController = $vendorOrderController;
        $this->adminOrderController = $adminOrderController;
    }

    /**
     * List orders for authenticated user/vendor/admin
     * 
     * GET /api/v1/orders
     * - User: Gets their own orders
     * - Vendor: Gets orders containing their products
     * - Admin: Gets all orders
     */
    public function index(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'user' => $this->userOrderController->index($request),
            'vendor' => $this->vendorOrderController->index($request),
            'admin' => $this->adminOrderController->index($request),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Get order statistics
     * 
     * GET /api/v1/orders/stats
     * - User: Not available
     * - Vendor: Gets their order stats
     * - Admin: Gets all order stats
     */
    public function stats(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'vendor' => $this->vendorOrderController->stats($request),
            'admin' => $this->adminOrderController->stats(), // Admin stats doesn't need request
            'user' => ApiResponse::error('Statistics not available for users', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Show single order
     * 
     * GET /api/v1/orders/{orderNumber}
     * - User: Can only view their own orders
     * - Vendor: Can view orders containing their products
     * - Admin: Can view any order
     */
    public function show(Request $request, string $orderNumber)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'user' => $this->userOrderController->show($request, $orderNumber),
            'vendor' => $this->vendorOrderController->show($request, $orderNumber),
            'admin' => $this->adminOrderController->show($orderNumber), // Admin doesn't need request
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Update order status
     * 
     * PUT /api/v1/orders/{orderId}/status
     * - User: Cannot update
     * - Vendor: Can update their order items
     * - Admin: Can update any order
     * 
     * @param UpdateOrderStatusRequest $request Laravel will auto-resolve specific FormRequest based on route
     * @param int $orderId
     * @return mixed
     */
    public function updateStatus(UpdateOrderStatusRequest $request, int $orderId)
    {
        $userType = DetectUserType::getUserType($request);
        
        // Laravel's DI will resolve the correct FormRequest type in target controller
        /** @phpstan-ignore-next-line */
        return match($userType) {
            'vendor' => $this->vendorOrderController->updateStatus($request, $orderId),
            'admin' => $this->adminOrderController->updateStatus($request, $orderId),
            'user' => ApiResponse::error('Users cannot update order status', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Cancel order
     * 
     * POST /api/v1/orders/{orderNumber}/cancel
     * - User: Can cancel their own pending orders
     * - Vendor: Can cancel their order items
     * - Admin: Can cancel any order
     * 
     * @param CancelOrderRequest $request
     * @param mixed $orderNumberOrId
     * @return mixed
     */
    public function cancel(CancelOrderRequest $request, $orderNumberOrId)
    {
        $userType = DetectUserType::getUserType($request);
        
        /** @phpstan-ignore-next-line */
        return match($userType) {
            'user' => $this->userOrderController->cancel($request, $orderNumberOrId),
            'vendor' => $this->vendorOrderController->cancel($request, $orderNumberOrId),
            'admin' => $this->adminOrderController->cancel($request, $orderNumberOrId),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Add note to order (Admin only)
     * 
     * POST /api/v1/orders/{orderId}/notes
     * 
     * @param AddOrderNoteRequest $request
     * @param int $orderId
     * @return mixed
     */
    public function addNote(AddOrderNoteRequest $request, int $orderId)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can add order notes', 403);
        }
        
        /** @phpstan-ignore-next-line */
        return $this->adminOrderController->addNote($request, $orderId);
    }

    /**
     * Get order notes (Admin only)
     * 
     * GET /api/v1/orders/{orderId}/notes
     */
    public function getNotes(Request $request, int $orderId)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType !== 'admin') {
            return ApiResponse::error('Only admins can view order notes', 403);
        }

        return $this->adminOrderController->getNotes($orderId); // Admin getNotes only needs orderId
    }
}
