<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Resources\Api\V1\Admin\VendorResource;
use App\Services\Admin\AdminVendorService;
use Illuminate\Http\Request;

class VendorController extends BaseAdminController
{
    public function __construct(
        protected AdminVendorService $service
    ) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $status = $request->query('status');

        $result = $this->service->list($perPage, $status);

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $paginator = $result->getData();

        // Transform with Resource in Controller (not Service)
        return VendorResource::collection($paginator);
    }

    public function show(string|int $id)
    {
        $vendor = $this->service->find((int)$id);
        
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        return $this->success(new VendorResource($vendor->load(['roles', 'addresses', 'bankAccounts', 'commissionPlan'])));
    }

    public function store(\App\Http\Requests\Api\V1\Admin\StoreVendorRequest $request)
    {
        $data = $request->validated();

        $vendor = $this->service->create($data);

        return $this->success(new VendorResource($vendor->load('roles')), 'Satıcı oluşturuldu', 201);
    }    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $vendor = $this->service->find((int)$id);
        
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        $result = $this->service->update((int)$id, $data);

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $updatedVendor = $result->getData();

        return $this->success(new VendorResource($updatedVendor->load('roles')), 'Satıcı güncellendi', 200);
    }

    public function destroy(string|int $id)
    {
        $vendor = $this->service->find((int)$id);
        
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        $this->service->delete((int)$id);

        return $this->success(null, 'Satıcı silindi', 200);
    }

    public function updateStatus(Request $request, string $id)
    {
        $vendor = $this->service->find((int)$id);
        
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        $status = $request->input('status');
        $result = $this->service->update((int)$id, ['status' => $status]);

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $updatedVendor = $result->getData();

        return $this->success(new VendorResource($updatedVendor), 'Satıcı durumu güncellendi');
    }

    /**
     * Satıcının seçtiği kategorileri getir (read-only for admin)
     */
    public function getVendorCategories(string|int $id)
    {
        $vendor = $this->service->find((int)$id);
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        $categories = $vendor->allowedCategories()->with('parent:id,name')->get();

        return $this->success([
            'vendor_id' => $vendor->id,
            'vendor_name' => $vendor->name,
            'categories' => $categories
        ]);
    }
}
