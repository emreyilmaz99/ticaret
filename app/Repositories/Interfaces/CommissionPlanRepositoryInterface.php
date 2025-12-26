<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\BaseRepositoryInterface;

interface CommissionPlanRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get the default commission plan
     */
    public function findDefault();

    /**
     * Get all active commission plans
     */
    public function listActive();

    /**
     * Set a commission plan as default (unsets others)
     */
    public function setAsDefault(int $id): bool;

    /**
     * Toggle active status
     */
    public function toggleActive(int $id): bool;

    /**
     * Count vendors using this commission plan
     */
    public function countVendors(int $id): int;

    /**
     * Find and return fresh model data
     */
    public function findFresh(int $id);
}
