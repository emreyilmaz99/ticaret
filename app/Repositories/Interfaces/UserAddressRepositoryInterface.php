<?php

namespace App\Repositories\Interfaces;

use App\Models\UserAddress;
use Illuminate\Support\Collection;

interface UserAddressRepositoryInterface
{
    /**
     * Get all addresses for a user ordered by default and created date
     */
    public function getForUser(int $userId): Collection;

    /**
     * Find a specific address for a user
     */
    public function findForUser(int $userId, int $addressId): ?UserAddress;

    /**
     * Count addresses for a user
     */
    public function countForUser(int $userId): int;

    /**
     * Clear default status for all addresses of a user
     */
    public function clearDefaultForUser(int $userId): void;

    /**
     * Clear default status for all addresses except a specific one
     */
    public function clearDefaultExcept(int $userId, int $addressId): void;

    /**
     * Find first address for user excluding a specific one
     */
    public function findFirstExcluding(int $userId, int $excludeAddressId): ?UserAddress;

    /**
     * Create a new address
     */
    public function create(array $data): UserAddress;

    /**
     * Update an address
     */
    public function update(UserAddress $address, array $data): bool;

    /**
     * Delete an address
     */
    public function delete(UserAddress $address): bool;
}
