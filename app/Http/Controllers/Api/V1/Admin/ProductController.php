<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkUpdateProductStatusRequest;
use App\Http\Requests\Api\V1\Admin\UpdateProductStatusRequest;
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

        return $this->fromServiceResponse(
            $this->service->list($filters, $request->input('per_page', 15))
        );
    }

    public function show($id)
    {
        return $this->fromServiceResponse($this->service->find($id));
    }

    public function updateStatus(UpdateProductStatusRequest $request, $id)
    {
        return $this->fromServiceResponse(
            $this->service->updateStatus(
                $id,
                $request->input('status'),
                $request->input('rejection_reason'),
                $request->user()->id
            )
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
