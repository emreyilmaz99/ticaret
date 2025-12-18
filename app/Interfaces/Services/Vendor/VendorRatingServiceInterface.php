<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;

interface VendorRatingServiceInterface
{
    public function create(int $vendorId, int $userId, array $data): ServiceResponse;
    public function approve(int $ratingId): ServiceResponse;
    public function listApproved(int $vendorId, int $perPage = 15);
    public function listAll(int $vendorId, int $perPage = 15);
}
