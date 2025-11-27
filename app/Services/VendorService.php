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

    /**
     * Return a paginated, optimized list that uses Query Builder to avoid Eloquent model hydration.
     * Useful for large lists where only a few columns are needed.
     *
     * @param int $perPage
     * @param array $filters
     * @param array $select
     * @return mixed
     */
    public function listOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at'])
    {
        return $this->repo->paginateOptimized($perPage, $filters, $select);
    }

    /**
     * Wrapper that returns a ServiceResponse compatible payload for admin listing.
     */
    public function listForAdminResponse(int $perPage = 15)
    {
        $paginator = $this->listOptimized($perPage);

        $data = [
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)
           ->setStatusCode(200)
           ->setMessage('Satıcılar listelendi')
           ->setData($data);

        return $sr;
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
