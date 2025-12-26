<?php

namespace App\Repositories;

use App\Models\UserAddress;
use App\Repositories\Interfaces\UserAddressRepositoryInterface;
use Illuminate\Support\Collection;

class UserAddressRepository implements UserAddressRepositoryInterface
{
    /**
     * Get all addresses for a user ordered by default and created date
     */
    public function getForUser(int $userId): Collection
    {
        return UserAddress::where('user_id', $userId)
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Find a specific address for a user
     */
    public function findForUser(int $userId, int $addressId): ?UserAddress
    {
        return UserAddress::where('user_id', $userId)
            ->where('id', $addressId)
            ->first();
    }

    /**
     * Count addresses for a user
     */
    public function countForUser(int $userId): int
    {
        return UserAddress::where('user_id', $userId)->count();
    }

    /**
     * Clear default status for all addresses of a user
     */
    public function clearDefaultForUser(int $userId): void
    {
        UserAddress::where('user_id', $userId)->update(['is_default' => false]);
    }

    /**
     * Clear default status for all addresses except a specific one
     */
    public function clearDefaultExcept(int $userId, int $addressId): void
    {
        UserAddress::where('user_id', $userId)
            ->where('id', '!=', $addressId)
            ->update(['is_default' => false]);
    }

    /**
     * Find first address for user excluding a specific one
     */
    public function findFirstExcluding(int $userId, int $excludeAddressId): ?UserAddress
    {
        return UserAddress::where('user_id', $userId)
            ->where('id', '!=', $excludeAddressId)
            ->first();
    }

    /**
     * Create a new address
     */
    public function create(array $data): UserAddress
    {
        return UserAddress::create($data);
    }

    /**
     * Update an address
     */
    public function update(UserAddress $address, array $data): bool
    {
        return $address->update($data);
    }

    /**
     * Delete an address
     */
    public function delete(UserAddress $address): bool
    {
        return $address->delete();
    }
}
