<?php

namespace App\Interfaces\Services\Vendor;

use App\Models\Vendor;

interface VendorApplicationFullServiceInterface
{
    /**
     * Submit full application
     */
    public function submitFullApplication(Vendor $vendor, array $data);

    /**
     * Approve full application
     */
    public function approveFullApplication(int $id, int $adminId, ?int $commissionPlanId);

    /**
     * Reject full application
     */
    public function rejectFullApplication(int $id, int $adminId, string $reason);

    /**
     * Approve vendor full application
     */
    public function approveVendorFullApplication(int $vendorId, int $adminId, ?int $commissionPlanId);

    /**
     * Reject vendor full application
     */
    public function rejectVendorFullApplication(int $vendorId, int $adminId, string $reason);
}
