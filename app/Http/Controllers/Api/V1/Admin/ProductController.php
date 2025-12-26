<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkUpdateProductStatusRequest;
use App\Http\Requests\Api\V1\Admin\UpdateProductStatusRequest;
use App\Http\Resources\Api\V1\Shared\ProductResource;
use App\Interfaces\Services\Admin\AdminProductManagementServiceInterface;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected AdminProductManagementServiceInterface $service
    ) {}

    public function index(Request $request)
    {
        $filters = [
            'status' => $request->input('status'),
            'vendor_id' => $request->input('vendor_id'),
            'search' => $request->input('search'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        $response = $this->service->list($filters, $request->input('per_page', 15));
        
        if (!$response->isSuccess()) {
            return $this->fromServiceResponse($response);
        }
        
        return $this->success(
            ProductResource::collection($response->getData()),
            $response->getMessage()
        );
    }

    public function show($id)
    {
        $response = $this->service->find($id);
        
        if (!$response->isSuccess()) {
            return $this->fromServiceResponse($response);
        }
        
        return $this->success(
            new ProductResource($response->getData()),
            $response->getMessage()
        );
    }

    public function updateStatus(Request $request, $id)
    {
        $response = $this->service->updateStatus(
            $id,
            $request->input('status'),
            $request->input('rejection_reason'),
            $request->user()->id
        );
        
        if (!$response->isSuccess()) {
            return $this->fromServiceResponse($response);
        }
        
        return $this->success(
            new ProductResource($response->getData()),
            $response->getMessage()
        );
    }

    public function bulkUpdateStatus(BulkUpdateProductStatusRequest $request)
    {
        return $this->fromServiceResponse(
            $this->service->bulkUpdateStatus(
                $request->input('product_ids'),
                $request->input('status'),
                $request->input('rejection_reason'),
                $request->user()->id
            )
        );
    }

    public function destroy($id)
    {
        return $this->fromServiceResponse($this->service->delete($id));
    }

    public function statistics()
    {
        return $this->fromServiceResponse($this->service->getStatistics());
    }
}
