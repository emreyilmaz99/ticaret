<?php

namespace App\Interfaces\Services\Admin;

use App\Core\ServiceResponse;

interface AdminBannedWordServiceInterface
{
    public function list(array $filters): ServiceResponse;
    public function create(array $data): ServiceResponse;
    public function update(int $id, array $data): ServiceResponse;
    public function delete(int $id): ServiceResponse;
    public function bulkCreate(array $words): ServiceResponse;
    public function bulkDelete(array $ids): ServiceResponse;
    public function getStats(): ServiceResponse;
    public function testText(string $text): ServiceResponse;
}
