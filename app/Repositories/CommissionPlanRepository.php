<?php

namespace App\Repositories;

use App\Models\CommissionPlan;
use App\Repositories\Interfaces\CommissionPlanRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CommissionPlanRepository extends EloquentBaseRepository implements CommissionPlanRepositoryInterface
{
    public function __construct(CommissionPlan $model)
    {
        parent::__construct($model);
    }

    /**
     * Get the default commission plan
     */
    public function findDefault()
    {
        return $this->model->where('is_default', true)->first();
    }

    /**
     * Get all active commission plans
     */
    public function listActive()
    {
        return $this->model->where('is_active', true)->get();
    }

    /**
     * Set a commission plan as default (unsets others)
     * If $id is 0, it only clears existing defaults.
     */
    public function setAsDefault(int $id): bool
    {
        // Begin transaction
        DB::beginTransaction();
        
        try {
            // Unset all other defaults
            $this->model->where('is_default', true)->update(['is_default' => false]);
            
            // Set this one as default if ID is valid
            if ($id > 0) {
                $plan = $this->model->find($id);
                if ($plan) {
                    $plan->is_default = true;
                    $plan->save();
                }
            }
            
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            return false;
        }
    }

    /**
     * Toggle active status
     */
    public function toggleActive(int $id): bool
    {
        try {
            $plan = $this->model->find($id);
            $plan->is_active = !$plan->is_active;
            $plan->save();
            
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Count vendors using this commission plan
     */
    public function countVendors(int $id): int
    {
        $plan = $this->model->find($id);
        return $plan ? $plan->vendors()->count() : 0;
    }

    /**
     * Find and refresh the model
     */
    public function findFresh(int $id): ?CommissionPlan
    {
        return $this->model->find($id);
    }
}
