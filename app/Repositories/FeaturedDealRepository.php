<?php

namespace App\Repositories;

use App\Models\FeaturedDeal;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class FeaturedDealRepository
{
    public function __construct(
        protected FeaturedDeal $model
    ) {}

    /**
     * Get filtered featured deals with pagination
     */
    public function getFiltered(array $filters): LengthAwarePaginator
    {
        $query = $this->model->with(['product.photos', 'product.vendor', 'variant'])
            ->ordered();

        if (isset($filters['status'])) {
            match ($filters['status']) {
                'active' => $query->where('is_active', true),
                'current' => $query->current(),
                'expired' => $query->expired(),
                'upcoming' => $query->upcoming(),
                'inactive' => $query->where('is_active', false),
                default => null
            };
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->where('is_active', true)->count(),
            'current' => $this->model->current()->count(),
            'upcoming' => $this->model->upcoming()->count(),
            'expired' => $this->model->expired()->count(),
            'inactive' => $this->model->where('is_active', false)->count(),
        ];
    }

    /**
     * Find featured deal by ID
     */
    public function find(int $id): ?FeaturedDeal
    {
        return $this->model->with(['product.photos', 'product.vendor', 'variant'])
            ->find($id);
    }

    /**
     * Create new featured deal
     */
    public function create(array $data): FeaturedDeal
    {
        return $this->model->create($data);
    }

    /**
     * Update featured deal
     */
    public function update(int $id, array $data): FeaturedDeal
    {
        $deal = $this->model->findOrFail($id);
        $deal->update($data);
        return $deal->fresh();
    }

    /**
     * Delete featured deal
     */
    public function delete(int $id): bool
    {
        $deal = $this->model->findOrFail($id);
        return $deal->delete();
    }

    /**
     * Update sort order for multiple deals
     */
    public function updateSortOrder(array $deals): void
    {
        foreach ($deals as $deal) {
            $this->model->where('id', $deal['id'])
                ->update(['sort_order' => $deal['sort_order']]);
        }
    }

    /**
     * Toggle active status
     */
    public function toggleActive(int $id): FeaturedDeal
    {
        $deal = $this->model->findOrFail($id);
        $deal->update(['is_active' => !$deal->is_active]);
        return $deal->fresh();
    }

    /**
     * Get current active deals
     */
    public function getCurrentActive(): Collection
    {
        return $this->model->with(['product.photos', 'product.vendor', 'variant'])
            ->current()
            ->where('is_active', true)
            ->ordered()
            ->get();
    }

    /**
     * Check for overlapping deals
     */
    public function hasOverlappingDeal(string $productId, ?int $variantId, string $startDate, string $endDate, ?int $excludeId = null): bool
    {
        $query = $this->model->where('product_id', $productId)
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q2) use ($startDate, $endDate) {
                        $q2->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            });

        if ($variantId) {
            $query->where('variant_id', $variantId);
        }

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Find deal by ID or fail
     */
    public function findOrFail(int $id): FeaturedDeal
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $id): void
    {
        $deal = $this->model->find($id);
        if ($deal) {
            $deal->incrementViews();
        }
    }

    /**
     * Increment click count
     */
    public function incrementClicks(int $id): void
    {
        $deal = $this->model->find($id);
        if ($deal) {
            $deal->incrementClicks();
        }
    }

    /**
     * Increment conversion count
     */
    public function incrementConversions(int $id): void
    {
        $deal = $this->model->find($id);
        if ($deal) {
            $deal->incrementConversions();
        }
    }
}
