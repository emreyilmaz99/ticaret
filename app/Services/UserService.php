<?php

namespace App\Services;

use App\Repositories\UserRepository;

class UserService extends BaseService
{
    protected UserRepository $repo;

    public function __construct(UserRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function find(int $id)
    {
        return $this->repo->find($id);
    }
}
