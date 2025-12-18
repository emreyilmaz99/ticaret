<?php

namespace App\Interfaces\Services\Admin;

use App\Core\ServiceResponse;

interface AdminProductManagementServiceInterface
{
    public function list(array $filters, int $perPage): ServiceResponse;
    public function find(int $id): ServiceResponse;
    public function updateStatus(int $id, string $status, ?string $rejectionReason, ?int $adminId): ServiceResponse;
    public function bulkUpdateStatus(array $productIds, string $status, ?string $rejectionReason, ?int $adminId): ServiceResponse;
    public function delete(int $id): ServiceResponse;
    public function getStatistics(): ServiceResponse;
}
