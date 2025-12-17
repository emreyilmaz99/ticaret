<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\User\StoreUserAddressRequest;
use App\Http\Requests\Api\V1\User\UpdateUserAddressRequest;
use App\Services\User\UserAddressService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected UserAddressService $addressService
    ) {}

    /**
     * Get all addresses for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->addressService->getUserAddresses($request->user()->id)
        );
    }

    /**
     * Store a new address.
     */
    public function store(StoreUserAddressRequest $request): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->addressService->createAddress($request->user()->id, $request->validated())
        );
    }

    /**
     * Get a specific address.
     */
    public function show(Request $request, int $addressId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->addressService->getAddress($request->user()->id, $addressId)
        );
    }

    /**
     * Update an address.
     */
    public function update(UpdateUserAddressRequest $request, int $addressId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->addressService->updateAddress($request->user()->id, $addressId, $request->validated())
        );
    }

    /**
     * Delete an address.
     */
    public function destroy(Request $request, int $addressId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->addressService->deleteAddress($request->user()->id, $addressId)
        );
    }

    /**
     * Set an address as default.
     */
    public function setDefault(Request $request, int $addressId): JsonResponse
    {
        return $this->fromServiceResponse(
            $this->addressService->setDefaultAddress($request->user()->id, $addressId)
        );
    }
}
