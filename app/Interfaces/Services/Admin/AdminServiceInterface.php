<?php

namespace App\Interfaces\Services\Admin;

use App\Core\ServiceResponse;

interface AdminServiceInterface
{
    /**
     * List admins
     */
    public function list(int $perPage = 15): ServiceResponse;

    /**
     * Find admin
     */
    public function find(int $id): ServiceResponse;

    /**
     * Get current authenticated admin
     */
    public function getCurrentAdmin($admin): ServiceResponse;

    /**
     * Create admin
     */
    public function create(array $data): ServiceResponse;

    /**
     * Update admin
     */
    public function update(int $id, array $data): ServiceResponse;

    /**
     * Delete admin
     */
    public function delete(int $id): ServiceResponse;

    /**
     * Create admin with roles
     */
    public function createWithRoles(array $data, array $roles = []): ServiceResponse;

    /**
     * List admins with formatted response
     */
    public function listForAdminResponse(int $perPage = 15): ServiceResponse;

    /**
     * Update admin roles and status
     */
    public function updateRolesAndStatus(int $id, array $roles = [], ?bool $isActive = null): ServiceResponse;

    /**
     * List admin permissions
     */
    public function listPermissionsForAdmin(int $adminId): ServiceResponse;

    /**
     * Update admin permissions
     */
    public function updateAdminPermissions(int $adminId, array $permissions): ServiceResponse;

    /**
     * List vendor payouts
     */
    public function listVendorPayouts(int $perPage = 15);

    /**
     * Find payout
     */
    public function findPayout(int $id): ServiceResponse;

    /**
     * Update payout status
     */
    public function updatePayoutStatus(int $payoutId, string $status, int $adminId): ServiceResponse;
}
