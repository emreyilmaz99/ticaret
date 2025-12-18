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
     * List vendors for admin response
     */
    public function listForAdminResponse(int $perPage, ?string $status);

    /**
     * Find vendor by ID
     */
    public function find(int $id);

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

    /**
     * Add vendor address
     */
    public function addAddress(int $vendorId, array $data);

    /**
     * List vendor addresses
     */
    public function listAddresses(int $vendorId);

    /**
     * Update vendor address
     */
    public function updateAddress(int $vendorId, int $addressId, array $data);

    /**
     * Delete vendor address
     */
    public function deleteAddress(int $vendorId, int $addressId);

    /**
     * Add vendor bank account
     */
    public function addBankAccount(int $vendorId, array $data);

    /**
     * List vendor bank accounts
     */
    public function listBankAccounts(int $vendorId);

    /**
     * Update vendor bank account
     */
    public function updateBankAccount(int $vendorId, int $accountId, array $data);

    /**
     * Delete vendor bank account
     */
    public function deleteBankAccount(int $vendorId, int $accountId);

    /**
     * Get public vendor profile
     */
    public function getPublicProfile(string $slug): ServiceResponse;

    /**
     * Get vendor products
     */
    public function getProducts(string $slug, array $filters): ServiceResponse;

    /**
     * Get vendor categories
     */
    public function getCategories(string $slug): ServiceResponse;

    /**
     * Get vendor reviews
     */
    public function getReviews(string $slug, array $filters): ServiceResponse;
}
