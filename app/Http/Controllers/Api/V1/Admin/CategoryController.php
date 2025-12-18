<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkUpdateCategoryStatusRequest;
use App\Http\Requests\Api\V1\Admin\StoreCategoryRequest;
use App\Http\Requests\Api\V1\Admin\UpdateCategoryOrderRequest;
use App\Http\Requests\Api\V1\Admin\UpdateCategoryRequest;
use App\Interfaces\Services\Admin\AdminCategoryServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected AdminCategoryServiceInterface $service
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'parent_id' => $request->input('parent_id'),
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'all' => $request->boolean('all'),
            'per_page' => $request->integer('per_page', 50),
        ];

        return $this->fromServiceResponse($this->service->list($filters));
    }

    public function tree()
    {
        return $this->fromServiceResponse($this->service->getTree());
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        
        if ($request->hasFile('image')) {
            $data['image_file'] = $request->file('image');
        }

        return $this->fromServiceResponse($this->service->create($data));
    }

    public function show(int $id)
    {
        return $this->fromServiceResponse($this->service->find($id));
    }

    public function update(UpdateCategoryRequest $request, int $id)
    {
        $data = $request->validated();
        
        if ($request->hasFile('image')) {
            $data['image_file'] = $request->file('image');
        }

        return $this->fromServiceResponse($this->service->update($id, $data));
    }

    public function destroy(int $id)
    {
        return $this->fromServiceResponse($this->service->delete($id));
    }

    public function bulkUpdateStatus(BulkUpdateCategoryStatusRequest $request)
    {
        return $this->fromServiceResponse(
            $this->service->bulkUpdateStatus(
                $request->input('category_ids'),
                $request->input('is_active')
            )
        );
    }

    public function updateOrder(UpdateCategoryOrderRequest $request)
    {
        return $this->fromServiceResponse($this->service->updateOrder($request->input('categories')));
    }

    public function statistics()
    {
        return $this->fromServiceResponse($this->service->getStatistics());
    }
}
