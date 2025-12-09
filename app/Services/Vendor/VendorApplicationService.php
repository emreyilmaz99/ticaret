<?php

namespace App\Services\Vendor;

use App\Services\BaseService;
use App\Services\Vendor\VendorApplicationPreService;
use App\Services\Vendor\VendorApplicationFullService;
use App\Services\Vendor\VendorApplicationQueryService;
use App\Models\Vendor;

/**
 * VendorApplicationService (Facade)
 * 
 * This is a backward-compatible facade that delegates to specialized sub-services.
 * All methods are marked as @deprecated to encourage direct use of sub-services.
 */
class VendorApplicationService extends BaseService
{
    protected VendorApplicationPreService $preService;
    protected VendorApplicationFullService $fullService;
    protected VendorApplicationQueryService $queryService;

    public function __construct(
        VendorApplicationPreService $preService,
        VendorApplicationFullService $fullService,
        VendorApplicationQueryService $queryService
    ) {
        $this->preService = $preService;
        $this->fullService = $fullService;
        $this->queryService = $queryService;
    }

    /**
     * @deprecated Use VendorApplicationPreService::submitPreApplication() instead
     */
    public function submitPreApplication(array $data)
    {
        return $this->preService->submitPreApplication($data);
    }

    /**
     * @deprecated Use VendorApplicationPreService::approvePreApplication() instead
     */
    public function approvePreApplication(int $id, int $adminId)
    {
        return $this->preService->approvePreApplication($id, $adminId);
    }

    /**
     * @deprecated Use VendorApplicationPreService::rejectPreApplication() instead
     */
    public function rejectPreApplication(int $id, int $adminId, string $reason)
    {
        return $this->preService->rejectPreApplication($id, $adminId, $reason);
    }

    /**
     * @deprecated Use VendorApplicationFullService::submitFullApplication() instead
     */
    public function submitFullApplication(Vendor $vendor, array $data)
    {
        return $this->fullService->submitFullApplication($vendor, $data);
    }

    /**
     * @deprecated Use VendorApplicationFullService::approveFullApplication() instead
     */
    public function approveFullApplication(int $id, int $adminId, ?int $commissionPlanId = null)
    {
        return $this->fullService->approveFullApplication($id, $adminId, $commissionPlanId);
    }

    /**
     * @deprecated Use VendorApplicationFullService::rejectFullApplication() instead
     */
    public function rejectFullApplication(int $id, int $adminId, string $reason)
    {
        return $this->fullService->rejectFullApplication($id, $adminId, $reason);
    }

    /**
     * @deprecated Use VendorApplicationFullService::approveVendorFullApplication() instead
     */
    public function approveVendorFullApplication(int $vendorId, int $adminId, ?int $commissionPlanId = null)
    {
        return $this->fullService->approveVendorFullApplication($vendorId, $adminId, $commissionPlanId);
    }

    /**
     * @deprecated Use VendorApplicationFullService::rejectVendorFullApplication() instead
     */
    public function rejectVendorFullApplication(int $vendorId, int $adminId, string $reason)
    {
        return $this->fullService->rejectVendorFullApplication($vendorId, $adminId, $reason);
    }

    /**
     * @deprecated Use VendorApplicationQueryService::index() instead
     */
    public function index(array $filters = [])
    {
        return $this->queryService->index($filters);
    }

    /**
     * @deprecated Use VendorApplicationQueryService::show() instead
     */
    public function show(int $id)
    {
        return $this->queryService->show($id);
    }

    /**
     * @deprecated Use VendorApplicationQueryService::getVendorApplicationStatus() instead
     */
    public function getVendorApplicationStatus(Vendor $vendor)
    {
        return $this->queryService->getVendorApplicationStatus($vendor);
    }

    /**
     * @deprecated Use VendorApplicationQueryService::getPendingPreApplications() instead
     */
    public function getPendingPreApplications()
    {
        return $this->queryService->getPendingPreApplications();
    }
}
