<?php

namespace App\Services;

use App\Core\ServiceResponse;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Support\Str;

class CategoryService extends BaseService
{
    protected CategoryRepositoryInterface $repo;

    public function __construct(CategoryRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function listForVendor($vendor, int $perPage = 15): ServiceResponse
    {
        $paginator = $this->repo->listByVendorWithDetails($vendor->id, $perPage);

        $items = collect($paginator->items())->map(function ($category) {
            return [
                'id' => $category->id,
                'parent_id' => $category->parent_id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'sort_order' => $category->sort_order,
                'is_active' => $category->is_active ?? true,
                'products_count' => $category->products_count ?? 0,
                'children_count' => $category->children_count ?? 0,
                'parent' => $category->parent ? [
                    'id' => $category->parent->id,
                    'name' => $category->parent->name,
                ] : null,
                'created_at' => $category->created_at,
                'updated_at' => $category->updated_at,
            ];
        });

        $data = [
            'data' => $items,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        return $this->successResponse($data, 'Categories listed');
    }

    public function createCategory($vendor, array $data): ServiceResponse
    {
        $baseSlug = Str::slug($data['name'] ?? 'category');
        $slug = $baseSlug;
        $i = 1;
        // Check slug uniqueness within this vendor's categories only
        while ($this->repo->existsBySlugForVendor($slug, $vendor->id)) {
            $slug = $baseSlug . '-' . $i;
            $i++;
        }

        // Validate parent belongs to same vendor
        if (!empty($data['parent_id'])) {
            $parent = $this->repo->findById($data['parent_id']);
            if (!$parent || $parent->vendor_id !== $vendor->id) {
                return $this->errorResponse('Parent category not found or not owned by vendor', 400);
            }
        }

        $category = $this->repo->create([
            'vendor_id' => $vendor->id,
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'] ?? null,
            'slug' => $slug,
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return $this->successResponse($category, 'Category created', 201);
    }

    public function updateCategory($vendor, $id, array $data): ServiceResponse
    {
        $category = $this->repo->findById($id);
        
        if (!$category) {
            return $this->errorResponse('Not found', 404);
        }
        
        if ($category->vendor_id !== $vendor->id) {
            return $this->errorResponse('Forbidden', 403);
        }

        // Validate parent belongs to same vendor and is not self or child
        if (isset($data['parent_id']) && $data['parent_id']) {
            if ($data['parent_id'] == $id) {
                return $this->errorResponse('Category cannot be its own parent', 400);
            }
            $parent = $this->repo->findById($data['parent_id']);
            if (!$parent || $parent->vendor_id !== $vendor->id) {
                return $this->errorResponse('Parent category not found or not owned by vendor', 400);
            }
        }

        // Update slug if name changed
        if (isset($data['name']) && $data['name'] !== $category->name) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $i = 1;
            // Check slug uniqueness within this vendor's categories only
            while ($this->repo->existsBySlugForVendorExcept($slug, $vendor->id, $id)) {
                $slug = $baseSlug . '-' . $i;
                $i++;
            }
            $data['slug'] = $slug;
        }

        $updated = $this->repo->update($id, $data);
        
        return $this->successResponse($updated, 'Category updated');
    }

    public function deleteCategory($vendor, $id): ServiceResponse
    {
        $category = $this->repo->findById($id);
        
        if (!$category) {
            return $this->errorResponse('Not found', 404);
        }
        
        if ($category->vendor_id !== $vendor->id) {
            return $this->errorResponse('Forbidden', 403);
        }

        // Check if has children
        if ($category->children()->count() > 0) {
            return $this->errorResponse('Cannot delete category with sub-categories', 400);
        }
        
        $this->repo->delete($id);
        
        return $this->successResponse(null, 'Deleted', 204);
    }

    public function toggleActive($vendor, $id): ServiceResponse
    {
        $category = $this->repo->findById($id);
        
        if (!$category) {
            return $this->errorResponse('Not found', 404);
        }
        
        if ($category->vendor_id !== $vendor->id) {
            return $this->errorResponse('Forbidden', 403);
        }

        $updated = $this->repo->update($id, [
            'is_active' => !$category->is_active,
        ]);
        
        return $this->successResponse($updated, 'Category status updated');
    }
}
