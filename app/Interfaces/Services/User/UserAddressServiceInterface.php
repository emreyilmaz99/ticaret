<?php

namespace App\Interfaces\Services\User;

use App\Core\ServiceResponse;

interface UserAddressServiceInterface
{
    /**
     * Get all addresses for user
     */
    public function getUserAddresses(int $userId): ServiceResponse;

    /**
     * Get single address
     */
    public function getAddress(int $userId, int $addressId): ServiceResponse;

    /**
     * Create new address
     */
    public function createAddress(int $userId, array $data): ServiceResponse;

    /**
     * Update address
     */
    public function updateAddress(int $userId, int $addressId, array $data): ServiceResponse;

    /**
     * Delete address
     */
    public function deleteAddress(int $userId, int $addressId): ServiceResponse;

    /**
     * Set default address
     */
    public function setDefaultAddress(int $userId, int $addressId): ServiceResponse;
}
