<?php

namespace App\Interfaces\Services\Admin;

use App\Core\ServiceResponse;

interface AdminReviewServiceInterface
{
    public function list(array $filters): ServiceResponse;
    public function bulkApprove(array $reviewIds): ServiceResponse;
    public function bulkReject(array $reviewIds, ?string $reason): ServiceResponse;
    public function approve(string $id): ServiceResponse;
    public function reject(string $id, string $reason): ServiceResponse;
    public function getStats(): ServiceResponse;
    public function getTrashed(int $perPage): ServiceResponse;
}
