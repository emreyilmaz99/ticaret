<?php

namespace App\Interfaces\Services\Tax;

use App\Core\ServiceResponse;

interface TaxClassCrudServiceInterface
{
    /**
     * List tax classes
     */
    public function list(array $filters = []): ServiceResponse;

    /**
     * Get active tax classes
     */
    public function getActive(): ServiceResponse;

    /**
     * Get default tax class
     */
    public function getDefault(): ServiceResponse;

    /**
     * Find tax class
     */
    public function find(int $id): ServiceResponse;

    /**
     * Create tax class
     */
    public function create(array $data): ServiceResponse;

    /**
     * Update tax class
     */
    public function update(int $id, array $data): ServiceResponse;

    /**
     * Delete tax class
     */
    public function delete(int $id): ServiceResponse;
}
