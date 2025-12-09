<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Services\Product\CategoryService;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ResponseHttp;

    protected CategoryService $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $vendor = $request->user();
        $perPage = (int) $request->query('per_page', 100);
        $sr = $this->service->listForVendor($vendor, $perPage);
        return $this->fromServiceResponse($sr);
    }

    public function store(Request $request)
    {
        $vendor = $request->user();
        $data = $request->validate([
            'name' => 'required|string|max:191',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $sr = $this->service->createCategory($vendor, $data);
        return $this->fromServiceResponse($sr);
    }

    public function update(Request $request, $id)
    {
        $vendor = $request->user();
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:191',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $sr = $this->service->updateCategory($vendor, $id, $data);
        return $this->fromServiceResponse($sr);
    }

    public function toggleActive(Request $request, $id)
    {
        $vendor = $request->user();
        $sr = $this->service->toggleActive($vendor, $id);
        return $this->fromServiceResponse($sr);
    }

    public function destroy(Request $request, $id)
    {
        $vendor = $request->user();
        $sr = $this->service->deleteCategory($vendor, $id);
        return $this->fromServiceResponse($sr);
    }
}
