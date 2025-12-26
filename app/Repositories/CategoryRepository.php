<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CategoryRepository implements CategoryRepositoryInterface
{
    protected Category $model;

    public function __construct(Category $model)
    {
        $this->model = $model;
    }

    public function create(array $data): Category
    {
        return $this->model->create($data);
    }

    public function update($id, array $data): Category
    {
        $category = $this->model->findOrFail($id);
        $category->update($data);
        return $category->fresh();
    }

    public function findById(int $id): ?Category
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $category = $this->model->findOrFail($id);
        return (bool) $category->delete();
    }

    public function listByVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('vendor_id', $vendorId)
            ->orderBy('sort_order', 'asc')
            ->paginate($perPage);
    }

    public function listByVendorWithDetails(int $vendorId, int $perPage = 100): LengthAwarePaginator
    {
        return $this->model->where('vendor_id', $vendorId)
            ->with('parent:id,name')
            ->withCount(['products', 'children'])
            ->orderBy('parent_id', 'asc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate($perPage);
    }

    public function existsBySlug(string $slug): bool
    {
        return $this->model->where('slug', $slug)->exists();
    }

    public function existsBySlugForVendor(string $slug, int $vendorId): bool
    {
        // Only check non-deleted categories for slug uniqueness
        return $this->model->where('slug', $slug)
            ->where('vendor_id', $vendorId)
            ->whereNull('deleted_at')
            ->exists();
    }

    public function existsBySlugExcept(string $slug, int $exceptId): bool
    {
        return $this->model->where('slug', $slug)
            ->where('id', '!=', $exceptId)
            ->exists();
    }

    public function existsBySlugForVendorExcept(string $slug, int $vendorId, int $exceptId): bool
    {
        return $this->model->where('slug', $slug)
            ->where('vendor_id', $vendorId)
            ->where('id', '!=', $exceptId)
            ->exists();
    }

    /**
     * Get filtered categories for admin
     */
    public function getFiltered(array $filters)
    {
        $query = $this->model->query()
            ->withCount(['children', 'directProducts'])
            ->with(['parent:id,name']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (isset($filters['parent_id'])) {
            if ($filters['parent_id'] === 'root') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $filters['parent_id']);
            }
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active'] === 'true' || $filters['is_active'] === '1');
        }

        $sortField = $filters['sort_field'] ?? 'sort_order';
        $sortOrder = $filters['sort_order'] ?? 'asc';
        $query->orderBy($sortField, $sortOrder)->orderBy('name');

        return isset($filters['per_page']) ? $query->paginate($filters['per_page']) : $query->get();
    }

    /**
     * Get category tree (hierarchical structure)
     */
    public function getTree()
    {
        return $this->model->whereNull('parent_id')
            ->with([
                'children' => fn($q) => $q->with([
                    'children' => fn($q2) => $q2->withCount('directProducts')
                        ->orderBy('sort_order')
                        ->orderBy('name')
                ])->withCount('directProducts')
                    ->orderBy('sort_order')
                    ->orderBy('name')
            ])
            ->withCount('directProducts')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    /**
     * Find category with details for admin
     */
    public function findWithDetails(int $id): ?Category
    {
        return $this->model->with([
            'parent:id,name',
            'children:id,parent_id,name,slug,icon,is_active,sort_order'
        ])
            ->withCount(['directProducts', 'children'])
            ->find($id);
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(array $ids, bool $isActive): int
    {
        return $this->model->whereIn('id', $ids)->update(['is_active' => $isActive]);
    }

    /**
     * Update sort orders for multiple categories
     */
    public function updateSortOrders(array $categories): void
    {
        foreach ($categories as $item) {
            $this->model->where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }
    }

    /**
     * Get category statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->where('is_active', true)->count(),
            'inactive' => $this->model->where('is_active', false)->count(),
            'root_categories' => $this->model->whereNull('parent_id')->count(),
            'sub_categories' => $this->model->whereNotNull('parent_id')->count(),
        ];
    }

    /**
     * Check if category has children
     */
    public function hasChildren(int $id): bool
    {
        return $this->model->where('parent_id', $id)->exists();
    }

    /**
     * Check if category has products
     */
    public function hasProducts(int $id): bool
    {
        $category = $this->model->find($id);
        return $category ? $category->directProducts()->exists() : false;
    }

    /**
     * Get category image path
     */
    public function getImagePath(int $id): ?string
    {
        $category = $this->model->find($id);
        return $category?->image;
    }

    /**
     * List active categories with optional filters (for public API)
     */
    public function listActivePublic(array $filters = [])
    {
        $query = $this->model->where('is_active', true)
            ->select(['id', 'parent_id', 'name', 'slug', 'icon', 'image', 'description']);

        // Root only filter
        if (isset($filters['root_only']) && ($filters['root_only'] === 'true' || $filters['root_only'] == '1')) {
            $query->whereNull('parent_id');
        }

        // Parent ID filter
        if (isset($filters['parent_id'])) {
            $query->where('parent_id', $filters['parent_id']);
        }

        return $query->orderBy('sort_order')->orderBy('name')->get();
    }

    /**
     * Get active category tree (for public API)
     */
    public function getActiveTree()
    {
        return $this->model->whereNull('parent_id')
            ->where('is_active', true)
            ->with(['activeChildren' => function ($q) {
                $q->with(['activeChildren' => function ($q2) {
                    $q2->select(['id', 'parent_id', 'name', 'slug', 'icon', 'image'])
                       ->orderBy('sort_order')
                       ->orderBy('name');
                }])
                ->select(['id', 'parent_id', 'name', 'slug', 'icon', 'image'])
                ->orderBy('sort_order')
                ->orderBy('name');
            }])
            ->select(['id', 'parent_id', 'name', 'slug', 'icon', 'image', 'description'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    /**
     * Find active category by slug with relations (for public API)
     */
    public function findActiveBySlug(string $slug): ?Category
    {
        return $this->model->where('slug', $slug)
            ->where('is_active', true)
            ->with(['activeChildren:id,parent_id,name,slug,icon,image', 'parent:id,name,slug'])
            ->first();
    }

    /**
     * Get category ID with children IDs
     */
    public function getCategoryWithChildrenIds(int $categoryId): array
    {
        return $this->model->where('id', $categoryId)
            ->orWhere('parent_id', $categoryId)
            ->pluck('id')
            ->toArray();
    }

    /**
     * Get category ID with children IDs by slug
     */
    public function getCategoryWithChildrenIdsBySlug(string $slug): array
    {
        $category = $this->model->where('slug', $slug)->first();
        if (!$category) {
            return [];
        }
        
        return $this->model->where('id', $category->id)
            ->orWhere('parent_id', $category->id)
            ->pluck('id')
            ->toArray();
    }

    /**
     * Get main categories with active product counts (for public homepage)
     */
    public function getMainCategoriesWithProductCounts()
    {
        return $this->model->whereNull('parent_id')
            ->where('is_active', true)
            ->with(['children' => fn($q) => $q->withCount('activeDirectProducts')])
            ->withCount('activeDirectProducts')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }
}
