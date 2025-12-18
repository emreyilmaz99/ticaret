<?php

namespace App\Services\Admin;

use App\Interfaces\Services\Admin\CommissionPlanServiceInterface;
use App\Repositories\Interfaces\CommissionPlanRepositoryInterface;
use App\Repositories\VendorRepository;
use App\Services\BaseService;

class CommissionPlanService extends BaseService implements CommissionPlanServiceInterface
{
    protected CommissionPlanRepositoryInterface $commissionPlanRepository;
    protected VendorRepository $vendorRepository;

    public function __construct(
        CommissionPlanRepositoryInterface $commissionPlanRepository,
        VendorRepository $vendorRepository
    ) {
        $this->commissionPlanRepository = $commissionPlanRepository;
        $this->vendorRepository = $vendorRepository;
    }

    /**
     * Get all commission plans
     */
    public function index(array $filters = [])
    {
        try {
            $plans = $this->commissionPlanRepository->paginate(15, $filters);
            return $this->successResponse($plans, 'Commission plans retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get active commission plans
     */
    public function getActive()
    {
        try {
            $plans = $this->commissionPlanRepository->listActive();
            return $this->successResponse($plans, 'Active commission plans retrieved');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get default commission plan
     */
    public function getDefault()
    {
        try {
            $plan = $this->commissionPlanRepository->findDefault();
            
            if (!$plan) {
                return $this->errorResponse('No default commission plan found', 404);
            }
            
            return $this->successResponse($plan, 'Default commission plan retrieved');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Create a new commission plan
     */
    public function store(array $data)
    {
        try {
            // If this is set as default, ensure no other plan is default
            if (isset($data['is_default']) && $data['is_default']) {
                $this->commissionPlanRepository->setAsDefault(0); // Clear all defaults first
            }

            $plan = $this->commissionPlanRepository->create($data);
            
            return $this->successResponse($plan, 'Commission plan created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Get a specific commission plan
     */
    public function show(int $id)
    {
        try {
            $plan = $this->commissionPlanRepository->find($id);
            
            if (!$plan) {
                return $this->errorResponse('Commission plan not found', 404);
            }
            
            return $this->successResponse($plan, 'Commission plan retrieved');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Update a commission plan
     */
    public function update(int $id, array $data)
    {
        try {
            // If this is being set as default, clear other defaults
            if (isset($data['is_default']) && $data['is_default']) {
                $this->commissionPlanRepository->setAsDefault($id);
                unset($data['is_default']); // Already handled
            }

            $plan = $this->commissionPlanRepository->update($id, $data);
            
            return $this->successResponse($plan, 'Commission plan updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Delete a commission plan
     */
    public function destroy(int $id)
    {
        try {
            $plan = $this->commissionPlanRepository->find($id);
            
            if (!$plan) {
                return $this->errorResponse('Commission plan not found', 404);
            }

            // Check if any vendors are using this plan
            $vendorCount = $plan->vendors()->count();
            
            if ($vendorCount > 0) {
                return $this->errorResponse(
                    "Cannot delete commission plan. {$vendorCount} vendor(s) are using this plan.",
                    400
                );
            }

            $this->commissionPlanRepository->delete($id);
            
            return $this->successResponse(null, 'Commission plan deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Set a commission plan as default
     */
    public function setAsDefault(int $id)
    {
        try {
            $plan = $this->commissionPlanRepository->find($id);
            
            if (!$plan) {
                return $this->errorResponse('Commission plan not found', 404);
            }

            $success = $this->commissionPlanRepository->setAsDefault($id);
            
            if (!$success) {
                return $this->errorResponse('Failed to set commission plan as default');
            }
            
            return $this->successResponse($plan, 'Commission plan set as default successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Toggle active status of a commission plan
     */
    public function toggleActive(int $id)
    {
        try {
            $plan = $this->commissionPlanRepository->find($id);
            
            if (!$plan) {
                return $this->errorResponse('Commission plan not found', 404);
            }

            $success = $this->commissionPlanRepository->toggleActive($id);
            
            if (!$success) {
                return $this->errorResponse('Failed to toggle commission plan status');
            }
            
            $plan->refresh();
            
            return $this->successResponse($plan, 'Commission plan status updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Assign a commission plan to a vendor
     */
    public function assignToVendor(int $vendorId, int $planId)
    {
        try {
            $plan = $this->commissionPlanRepository->find($planId);
            
            if (!$plan) {
                return $this->errorResponse('Commission plan not found', 404);
            }

            if (!$plan->is_active) {
                return $this->errorResponse('Cannot assign inactive commission plan', 400);
            }

            $vendor = $this->vendorRepository->find($vendorId);
            
            if (!$vendor) {
                return $this->errorResponse('Vendor not found', 404);
            }

            $vendor = $this->vendorRepository->update($vendorId, [
                'commission_plan_id' => $planId
            ]);
            
            return $this->successResponse($vendor, 'Commission plan assigned to vendor successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }
}
