<?php

namespace App\Services;

use App\Core\ServiceResponse;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryService
{
    public function listForVendor($vendor, int $perPage = 15): ServiceResponse
    {
        $paginator = Category::where('vendor_id', $vendor->id)->orderBy('sort_order', 'asc')->paginate($perPage);

        $data = [
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        $sr = new ServiceResponse();
        $sr->setSuccess(true)->setStatusCode(200)->setMessage('Categories listed')->setData($data);
        return $sr;
    }

    public function createCategory($vendor, array $data): ServiceResponse
    {
        $baseSlug = Str::slug($data['name'] ?? 'category');
        $slug = $baseSlug;
        $i = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $i;
            $i++;
        }

        $category = Category::create([
            'vendor_id' => $vendor->id,
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'] ?? null,
            'slug' => $slug,
            'description' => $data['description'] ?? null,
        ]);

        $sr = new ServiceResponse();
        $sr->setSuccess(true)->setStatusCode(201)->setMessage('Category created')->setData($category);
        return $sr;
    }

    public function deleteCategory($vendor, $id): ServiceResponse
    {
        $category = Category::find($id);
        $sr = new ServiceResponse();
        if (! $category) {
            $sr->setSuccess(false)->setStatusCode(404)->setMessage('Not found');
            return $sr;
        }
        if ($category->vendor_id !== $vendor->id) {
            $sr->setSuccess(false)->setStatusCode(403)->setMessage('Forbidden');
            return $sr;
        }
        $category->delete();
        $sr->setSuccess(true)->setStatusCode(204)->setMessage('Deleted')->setData(null);
        return $sr;
    }
}
