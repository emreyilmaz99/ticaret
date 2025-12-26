<?php

namespace App\Repositories;

use App\Models\TaxClass;
use App\Repositories\Interfaces\TaxClassRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TaxClassRepository implements TaxClassRepositoryInterface
{
    public function __construct(
        protected TaxClass $model
    ) {}

    /**
     * Find tax class by ID
     */
    public function find(int $id): ?TaxClass
    {
        return $this->model->find($id);
    }

    /**
     * Find tax class by ID with product count
     */
    public function findWithProductCount(int $id): ?TaxClass
    {
        $taxClass = $this->model->find($id);
        
        if ($taxClass) {
            $taxClass->products_count = $taxClass->products()->count();
        }
        
        return $taxClass;
    }

    /**
     * Get all tax classes with filters
     */
    public function getAll(array $filters = []): Collection
    {
        $query = $this->model->query()->ordered();

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['active_only']) && $filters['active_only']) {
            $query->active();
        }

        $taxClasses = $query->get();

        // Add product count to each tax class
        $taxClasses->each(function ($taxClass) {
            $taxClass->products_count = $taxClass->products()->count();
        });

        return $taxClasses;
    }

    /**
     * Get active tax classes
     */
    public function getActive(): Collection
    {
        return $this->model->active()->ordered()->get();
    }

    /**
     * Get default tax class
     */
    public function getDefault(): ?TaxClass
    {
        return $this->model->where('is_default', true)->first();
    }

    /**
     * Create tax class
     */
    public function create(array $data): TaxClass
    {
        return $this->model->create($data);
    }

    /**
     * Update tax class
     */
    public function update(int $id, array $data): TaxClass
    {
        $taxClass = $this->model->findOrFail($id);
        $taxClass->update($data);
        return $taxClass->fresh();
    }

    /**
     * Delete tax class
     */
    public function delete(int $id): bool
    {
        $taxClass = $this->model->findOrFail($id);
        return $taxClass->delete();
    }

    /**
     * Clear default flag from all except given ID
     */
    public function clearDefaultExcept(?int $exceptId = null): int
    {
        $query = $this->model->where('is_default', true);
        
        if ($exceptId) {
            $query->where('id', '!=', $exceptId);
        }
        
        return $query->update(['is_default' => false]);
    }

    /**
     * Get product count for tax class
     */
    public function getProductCount(int $id): int
    {
        $taxClass = $this->model->find($id);
        return $taxClass ? $taxClass->products()->count() : 0;
    }
}
