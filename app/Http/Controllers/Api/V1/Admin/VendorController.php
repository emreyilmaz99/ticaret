<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Resources\Api\V1\Admin\VendorResource;
use App\Services\VendorService;
use Illuminate\Http\Request;

class VendorController extends BaseAdminController
{
    protected VendorService $service;

    public function __construct(VendorService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);

        // Use service that returns a ServiceResponse-compatible object
        $serviceResponse = $this->service->listForAdminResponse($perPage);

        return $this->fromServiceResponse($serviceResponse);
    }

    public function show(int $id)
    {
        $vendor = $this->service->find($id);
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        return $this->success(new VendorResource($vendor->load('roles')));
    }

    public function store(\App\Http\Requests\Api\V1\Admin\StoreVendorRequest $request)
    {
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $vendor = $this->service->create($data);

        return $this->success(new VendorResource($vendor->load('roles')), 'Satıcı oluşturuldu', 201);
    }

    public function update(\App\Http\Requests\Api\V1\Admin\UpdateVendorRequest $request, int $id)
    {
        $data = $request->validated();
        $vendor = $this->service->find($id);
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $updated = $this->service->update($id, $data);

        return $this->success(new VendorResource($updated->load('roles')), 'Satıcı güncellendi', 200);
    }

    public function destroy(int $id)
    {
        $vendor = $this->service->find($id);
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        $this->service->delete($id);

        return $this->success(null, 'Satıcı silindi', 200);
    }

    public function updateStatus(\App\Http\Requests\Admin\UpdateVendorStatusRequest $request, int $id)
    {
        $vendor = $this->service->find($id);
        if (! $vendor) {
            return $this->error('Satıcı bulunamadı', 404);
        }

        $data = $request->validated();
        $vendor = $this->service->update($id, ['status' => $data['status']]);

        return $this->success(new \App\Http\Resources\VendorResource($vendor), 'Satıcı durumu güncellendi');
    }
}
