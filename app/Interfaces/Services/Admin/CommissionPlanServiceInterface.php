<?php

namespace App\Interfaces\Services\Admin;

interface CommissionPlanServiceInterface
{
    /**
     * List commission plans
     */
    public function index(array $filters = []);

    /**
     * Get active plans
     */
    public function getActive();

    /**
     * Get default plan
     */
    public function getDefault();

    /**
     * Create commission plan
     */
    public function store(array $data);

    /**
     * Show commission plan
     */
    public function show(int $id);

    /**
     * Update commission plan
     */
    public function update(int $id, array $data);

    /**
     * Delete commission plan
     */
    public function destroy(int $id);

    /**
     * Set plan as default
     */
    public function setAsDefault(int $id);

    /**
     * Toggle plan active status
     */
    public function toggleActive(int $id);

    /**
     * Assign plan to vendor
     */
    public function assignToVendor(int $vendorId, int $planId);
}
