<?php

namespace App\Services;

use App\Repositories\VendorRepository;

class VendorService extends BaseService
{
    protected VendorRepository $repo;

    public function __construct(VendorRepository $repo)
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

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }
}
