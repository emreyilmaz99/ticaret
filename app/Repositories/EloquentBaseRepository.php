<?php

namespace App\Repositories;

use App\Repositories\Interfaces\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

abstract class EloquentBaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $filters = [])
    {
        return $this->model->where($filters)->get();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    /**
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    /**
     * @return mixed
     */
    public function update($id, array $data)
    {
        $record = $this->model->findOrFail($id);
        $record->update($data);
        return $record;
    }

    public function delete($id): bool
    {
        $record = $this->model->findOrFail($id);
        return (bool) $record->delete();
    }

    public function paginate(int $perPage = 15, array $filters = [])
    {
        $query = $this->model->query();

        if (! empty($filters)) {
            $query->where($filters);
        }

        return $query->paginate($perPage);
    }
}
