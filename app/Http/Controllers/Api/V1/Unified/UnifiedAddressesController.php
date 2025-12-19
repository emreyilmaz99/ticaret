<?php

namespace App\Http\Controllers\Api\V1\Unified;

use App\Http\Controllers\Controller;
use App\Http\Middleware\DetectUserType;
use App\Core\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Api\V1\Unified\StoreAddressRequest;
use App\Http\Requests\Api\V1\Unified\UpdateAddressRequest;

class UnifiedAddressesController extends Controller
{
    protected $userAddressController;
    protected $vendorAddressController;

    public function __construct(
        \App\Http\Controllers\Api\V1\User\UserAddressController $userAddressController,
        \App\Http\Controllers\Api\V1\Vendor\AddressController $vendorAddressController
    ) {
        $this->userAddressController = $userAddressController;
        $this->vendorAddressController = $vendorAddressController;
    }

    /**
     * List addresses for authenticated user/vendor
     * 
     * GET /api/v1/addresses
     */
    public function index(Request $request)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'user' => $this->userAddressController->index($request),
            'vendor' => $this->vendorAddressController->index($request),
            'admin' => ApiResponse::error('Admins do not have addresses', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Create new address
     * 
     * POST /api/v1/addresses
     * 
     * @param StoreAddressRequest $request
     * @return mixed
     */
    public function store(StoreAddressRequest $request)
    {
        $userType = DetectUserType::getUserType($request);
        
        /** @phpstan-ignore-next-line */
        return match($userType) {
            'user' => $this->userAddressController->store($request),
            'vendor' => $this->vendorAddressController->store($request),
            'admin' => ApiResponse::error('Admins do not have addresses', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Show single address
     * 
     * GET /api/v1/addresses/{address}
     */
    public function show(Request $request, int $address)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'user' => $this->userAddressController->show($request, $address),
            'vendor' => ApiResponse::error('Vendor show method not available', 501),
            'admin' => ApiResponse::error('Admins do not have addresses', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Update address
     * 
     * PUT /api/v1/addresses/{address}
     * 
     * @param UpdateAddressRequest $request
     * @param int $address
     * @return mixed
     */
    public function update(UpdateAddressRequest $request, int $address)
    {
        $userType = DetectUserType::getUserType($request);
        
        /** @phpstan-ignore-next-line */
        return match($userType) {
            'user' => $this->userAddressController->update($request, $address),
            'vendor' => $this->vendorAddressController->update($request, $address),
            'admin' => ApiResponse::error('Admins do not have addresses', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Delete address
     * 
     * DELETE /api/v1/addresses/{address}
     */
    public function destroy(Request $request, int $address)
    {
        $userType = DetectUserType::getUserType($request);

        return match($userType) {
            'user' => $this->userAddressController->destroy($request, $address),
            'vendor' => $this->vendorAddressController->destroy($request, $address),
            'admin' => ApiResponse::error('Admins do not have addresses', 403),
            default => ApiResponse::error('Unknown user type', 400),
        };
    }

    /**
     * Set address as default (User only)
     * 
     * PUT /api/v1/addresses/{address}/default
     */
    public function setDefault(Request $request, int $address)
    {
        $userType = DetectUserType::getUserType($request);

        if ($userType === 'user') {
            return $this->userAddressController->setDefault($request, $address);
        }

        return ApiResponse::error('Only users can set default addresses', 403);
    }
}
