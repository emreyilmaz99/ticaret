<?php

namespace App\Services\User;

use App\Interfaces\Services\User\UserServiceInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Services\BaseService;

class UserService extends BaseService implements UserServiceInterface
{
    public function __construct(
        private readonly UserRepositoryInterface $repo
    ) {}

    public function list(int $perPage = 15, array $filters = [])
    {
        return $this->repo->paginateWithFilters($perPage, $filters);
    }

    public function find(int $id)
    {
        return $this->repo->findWithRelations($id);
    }

    public function update(int $id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    public function toggleStatus(int $id): bool
    {
        return $this->repo->toggleStatus($id);
    }

    public function getCurrentUser($user)
    {
        return $this->find($user->id);
    }
}
