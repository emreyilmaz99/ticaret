<?php

namespace App\Repositories;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Collection;

class UnitRepository
{
    public function __construct(
        protected Unit $model
    ) {}

    /**
     * Get all units ordered by ID
     */
    public function all(): Collection
    {
        return $this->model->orderBy('id')->get();
    }

    /**
     * Find unit by ID
     */
    public function findById(int $id): ?Unit
    {
        return $this->model->find($id);
    }

    /**
     * Create unit
     */
    public function create(array $data): Unit
    {
        return $this->model->create($data);
    }

    /**
     * Update unit
     */
    public function update(int $id, array $data): Unit
    {
        $unit = $this->model->findOrFail($id);
        $unit->update($data);
        return $unit->fresh();
    }

    /**
     * Delete unit
     */
    public function delete(int $id): bool
    {
        $unit = $this->model->find($id);
        return $unit ? (bool) $unit->delete() : false;
    }

    /**
     * Get active units
     */
    public function getActive(): Collection
    {
        return $this->model->where('is_active', true)->orderBy('name')->get();
    }
}
