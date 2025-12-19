<?php

namespace App\Interfaces\Services\Admin;

use App\Core\ServiceResponse;

interface AdminProductManagementServiceInterface
{
    public function list(array $filters, int $perPage): ServiceResponse;
    public function find(string $id): ServiceResponse;
    public function updateStatus(string $id, string $status, ?string $rejectionReason, ?int $adminId): ServiceResponse;
    public function bulkUpdateStatus(array $productIds, string $status, ?string $rejectionReason, ?int $adminId): ServiceResponse;
    public function delete(string $id): ServiceResponse;
    public function getStatistics(): ServiceResponse;
}
