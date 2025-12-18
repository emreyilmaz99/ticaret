<?php

namespace App\Interfaces\Services\Vendor;

use App\Models\Vendor;

/**
 * Facade interface for backward compatibility
 * 
 * This service acts as a facade that delegates to specialized sub-services:
 * - VendorApplicationPreService (for pre-applications)
 * - VendorApplicationFullService (for full applications)
 * - VendorApplicationQueryService (for queries)
 * 
 * Note: Individual methods in the implementation are marked as deprecated
 * to encourage direct use of specialized services, but the interface itself
 * remains active for backward compatibility and dependency injection.
 */
interface VendorApplicationServiceInterface
{
    public function submitPreApplication(array $data);
    public function approvePreApplication(int $id, int $adminId);
    public function rejectPreApplication(int $id, int $adminId, string $reason);
    public function submitFullApplication(Vendor $vendor, array $data);
    public function approveFullApplication(int $id, int $adminId, ?int $commissionPlanId = null);
    public function rejectFullApplication(int $id, int $adminId, string $reason);
    public function approveVendorFullApplication(int $vendorId, int $adminId, ?int $commissionPlanId = null);
    public function rejectVendorFullApplication(int $vendorId, int $adminId, string $reason);
    public function index(array $filters = []);
    public function getVendorApplicationStatus(Vendor $vendor);
}
