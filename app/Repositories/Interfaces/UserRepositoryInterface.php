<?php

namespace App\Repositories\Interfaces;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function create(array $data): User;
    
    /**
     * Update a user by User instance or ID
     * @param User|int $userOrId
     * @param array $data
     * @return User
     */
    public function update(User|int $userOrId, array $data): User;
    
    public function findById($id): ?User;
    public function delete(int $id): bool;
    public function paginateWithFilters(int $perPage = 15, array $filters = []): LengthAwarePaginator;
    public function findWithRelations(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function updateLastLogin(int $id): void;
    public function findWithAddresses(int $id): ?User;
    public function toggleStatus(int $id): bool;
}
