<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\StoreCommissionPlanRequest;
use App\Http\Requests\Api\V1\Admin\UpdateCommissionPlanRequest;
use App\Services\CommissionPlanService;
use App\Traits\ResponseHttp;

class CommissionPlanController extends Controller
{
    use ResponseHttp;

    protected CommissionPlanService $commissionPlanService;

    public function __construct(CommissionPlanService $commissionPlanService)
    {
        $this->commissionPlanService = $commissionPlanService;
    }

    /**
     * Display a listing of the commission plans.
     */
    public function index()
    {
        $result = $this->commissionPlanService->index();
        return $this->fromServiceResponse($result);
    }

    /**
     * Store a newly created commission plan.
     */
    public function store(StoreCommissionPlanRequest $request)
    {
        $result = $this->commissionPlanService->store($request->validated());
        return $this->fromServiceResponse($result);
    }

    /**
     * Display the specified commission plan.
     */
    public function show(int $id)
    {
        $result = $this->commissionPlanService->show($id);
        return $this->fromServiceResponse($result);
    }

    /**
     * Update the specified commission plan.
     */
    public function update(UpdateCommissionPlanRequest $request, int $id)
    {
        $result = $this->commissionPlanService->update($id, $request->validated());
        return $this->fromServiceResponse($result);
    }

    /**
     * Remove the specified commission plan.
     */
    public function destroy(int $id)
    {
        $result = $this->commissionPlanService->destroy($id);
        return $this->fromServiceResponse($result);
    }

    /**
     * Set a commission plan as default.
     */
    public function setDefault(int $id)
    {
        $result = $this->commissionPlanService->setAsDefault($id);
        return $this->fromServiceResponse($result);
    }

    /**
     * Toggle active status of a commission plan.
     */
    public function toggleActive(int $id)
    {
        $result = $this->commissionPlanService->toggleActive($id);
        return $this->fromServiceResponse($result);
    }

    /**
     * Get active commission plans.
     */
    public function active()
    {
        $result = $this->commissionPlanService->getActive();
        return $this->fromServiceResponse($result);
    }

    /**
     * Get default commission plan.
     */
    public function default()
    {
        $result = $this->commissionPlanService->getDefault();
        return $this->fromServiceResponse($result);
    }

    /**
     * Assign commission plan to vendor.
     */
    public function assignToVendor(int $vendorId)
    {
        $planId = request()->input('commission_plan_id');
        
        if (!$planId) {
            return response()->json([
                'success' => false,
                'message' => 'Commission plan ID is required'
            ], 400);
        }

        $result = $this->commissionPlanService->assignToVendor($vendorId, $planId);
        return $this->fromServiceResponse($result);
    }
}
