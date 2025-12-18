<?php

namespace App\Interfaces\Services\Admin;

use App\Core\ServiceResponse;

interface AdminFeaturedDealServiceInterface
{
    public function list(array $filters): ServiceResponse;
    public function getProductsForCreate(): ServiceResponse;
    public function create(array $data): ServiceResponse;
    public function find(int $id): ServiceResponse;
    public function update(int $id, array $data): ServiceResponse;
    public function delete(int $id): ServiceResponse;
    public function toggle(int $id): ServiceResponse;
    public function reorder(array $deals): ServiceResponse;
}
