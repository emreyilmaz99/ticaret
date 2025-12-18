<?php

namespace App\Interfaces\Services\Admin;

use App\Core\ServiceResponse;

interface AdminCategoryServiceInterface
{
    public function list(array $filters): ServiceResponse;
    public function getTree(): ServiceResponse;
    public function create(array $data): ServiceResponse;
    public function find(int $id): ServiceResponse;
    public function update(int $id, array $data): ServiceResponse;
    public function delete(int $id): ServiceResponse;
    public function bulkUpdateStatus(array $ids, bool $isActive): ServiceResponse;
    public function updateOrder(array $categories): ServiceResponse;
    public function getStatistics(): ServiceResponse;
}
