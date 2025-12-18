<?php

namespace App\Interfaces\Services\User;

interface UserServiceInterface
{
    /**
     * List users with pagination
     */
    public function list(int $perPage, array $filters);

    /**
     * Find user by ID
     */
    public function find(int $id);

    /**
     * Update user
     */
    public function update(int $id, array $data);

    /**
     * Delete user
     */
    public function delete(int $id): bool;

    /**
     * Toggle user status
     */
    public function toggleStatus(int $id): bool;
}
