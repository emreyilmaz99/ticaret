<?php

namespace App\Services\User;

use App\Interfaces\Services\User\UserServiceInterface;
use App\Repositories\UserRepository;
use App\Services\BaseService;

class UserService extends BaseService implements UserServiceInterface
{
    protected UserRepository $repo;

    public function __construct(UserRepository $repo)
    {
        $this->repo = $repo;
    }

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
        $user = $this->repo->find($id);
        if (!$user) {
            return false;
        }
        $user->is_active = !$user->is_active;
        $user->save();
        return true;
    }
}
