<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Resources\Api\V1\Admin\VendorResource;
use App\Interfaces\Services\Vendor\VendorServiceInterface;
use Illuminate\Http\Request;

class VendorController extends BaseAdminController
{
    protected VendorServiceInterface $service;

    public function __construct(VendorServiceInterface $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $status = $request->query('status');

        // Use service that returns a ServiceResponse-compatible object
        $serviceResponse = $this->service->listForAdminResponse($perPage, $status);

        return $this->fromServiceResponse($serviceResponse);
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
        // Password hashing is handled by the Vendor model mutator (`setPasswordAttribute`).
        // Do not pre-hash here to avoid double hashing.

        $vendor = $this->service->create($data);

        return $this->success(new VendorResource($vendor->load('roles')), 'Satıcı oluşturuldu', 201);
    }

    public function update(Request $request, string|int $id)
    {
        $data = $request->all();
        $vendor = $this->service->find((int)$id);
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        // Password hashing is handled by the Vendor model mutator (`setPasswordAttribute`).
        // Do not pre-hash here to avoid double hashing.

        $updated = $this->service->update((int)$id, $data);

        return $this->success(new VendorResource($updated->load('roles')), 'Satıcı güncellendi', 200);
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

    public function updateStatus(Request $request, string|int $id)
    {
        $vendor = $this->service->find((int)$id);
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        $status = $request->input('status');
        $vendor = $this->service->update((int)$id, ['status' => $status]);

        return $this->success(new VendorResource($vendor), 'Satıcı durumu güncellendi');
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
