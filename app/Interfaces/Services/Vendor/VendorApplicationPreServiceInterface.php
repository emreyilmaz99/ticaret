<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;
use App\Models\Vendor;

interface VendorApplicationPreServiceInterface
{
    /**
     * Submit pre-application
     */
    public function submitPreApplication(array $data);

    /**
     * Approve pre-application
     */
    public function approvePreApplication(int $id, int $adminId);

    /**
     * Reject pre-application
     */
    public function rejectPreApplication(int $id, int $adminId, string $reason);
}
