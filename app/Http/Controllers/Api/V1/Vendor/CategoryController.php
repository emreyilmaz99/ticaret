<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Vendor\StoreCategoryRequest;
use App\Http\Requests\Api\V1\Vendor\UpdateCategoryRequest;
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

    public function store(StoreCategoryRequest $request)
    {
        $vendor = $request->user();
        $sr = $this->service->createCategory($vendor, $request->validated());
        return $this->fromServiceResponse($sr);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $vendor = $request->user();
        $sr = $this->service->updateCategory($vendor, $id, $request->validated());
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
