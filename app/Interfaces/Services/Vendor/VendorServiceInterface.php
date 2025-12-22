<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;

interface VendorServiceInterface
{
    /**
     * List vendors with pagination
     */
    public function list(int $perPage = 15);

    /**
     * List vendors optimized with filters and select
     */
    public function listOptimized(int $perPage, array $filters, array $select);

    /**
     * Find vendor by ID
     */
    public function find(int $id);

    /**
     * Find vendor with stats
     */
    public function findWithStats(int $id);

    /**
     * Get current authenticated vendor
     */
    public function getCurrentVendor($vendor);

    /**
     * Create vendor
     */
    public function create(array $data);

    /**
     * Update vendor
     */
    public function update(int $id, array $data);

    /**
     * Delete vendor
     */
    public function delete(int $id): bool;

    // ==================== Deprecated Methods (Backward Compatibility) ====================

    /**
     * @deprecated Use VendorAddressService::add() instead
     */
    public function addAddress(int $vendorId, array $data);

    /**
     * @deprecated Use VendorAddressService::list() instead
     */
    public function listAddresses(int $vendorId);

    /**
     * @deprecated Use VendorAddressService::update() instead
     */
    public function updateAddress(int $vendorId, int $addressId, array $data);

    /**
     * @deprecated Use VendorAddressService::delete() instead
     */
    public function deleteAddress(int $vendorId, int $addressId);

    /**
     * @deprecated Use VendorBankAccountService::add() instead
     */
    public function addBankAccount(int $vendorId, array $data);

    /**
     * @deprecated Use VendorBankAccountService::list() instead
     */
    public function listBankAccounts(int $vendorId);

    /**
     * @deprecated Use VendorBankAccountService::update() instead
     */
    public function updateBankAccount(int $vendorId, int $accountId, array $data);

    /**
     * @deprecated Use VendorBankAccountService::delete() instead
     */
    public function deleteBankAccount(int $vendorId, int $accountId);
}
