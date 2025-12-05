<?php

namespace App\Repositories\Interfaces;

interface BaseRepositoryInterface
{
    public function all(array $filters = []);

    public function find($id);

    public function create(array $data);

    public function update($id, array $data);

    public function delete($id): bool;

    public function paginate(int $perPage = 15, array $filters = []);
}
