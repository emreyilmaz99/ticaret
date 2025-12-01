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
        $paginator = $this->repo->listByVendor($vendor->id, $perPage);

        $data = [
            'data' => $paginator->items(),
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
        while ($this->repo->existsBySlug($slug)) {
            $slug = $baseSlug . '-' . $i;
            $i++;
        }

        $category = $this->repo->create([
            'vendor_id' => $vendor->id,
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'] ?? null,
            'slug' => $slug,
            'description' => $data['description'] ?? null,
        ]);

        return $this->successResponse($category, 'Category created', 201);
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
        
        $this->repo->delete($id);
        
        return $this->successResponse(null, 'Deleted', 204);
    }
}
