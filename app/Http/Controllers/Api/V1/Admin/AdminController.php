<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Resources\Api\V1\Admin\AdminResource;
use App\Services\Admin\AdminService;
use Illuminate\Http\Request;

class AdminController extends BaseAdminController
{
    protected AdminService $service;

    public function __construct(AdminService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);

        $paginator = $this->service->list($perPage);

        return $this->paginated(
            $paginator,
            AdminResource::class,
            'Adminler başarıyla getirildi.'
        );
    }

    public function show(int $id)
    {
        $admin = $this->service->find($id);
        if (! $admin) {
            return $this->error('Admin not found', 404);
        }

        return $this->success(new AdminResource($admin->load('roles')));
    }

    public function store(\App\Http\Requests\Api\V1\Admin\StoreAdminRequest $request)
    {
        $data = $request->validated();
        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        $sr = $this->service->createWithRoles($data, $roles);

        return $this->fromServiceResponse($sr);
    }

    public function update(\App\Http\Requests\Api\V1\Admin\UpdateAdminRequest $request, int $id)
    {
        $data = $request->validated();
        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        // update basic fields
        $admin = $this->service->find($id);
        if (! $admin) {
            return $this->error('Admin not found', 404);
        }

        // hash handled by model mutator
        $this->service->update($id, $data);

        // update roles and status via dedicated method
        $sr = $this->service->updateRolesAndStatus($id, $roles, $data['is_active'] ?? null);

        return $this->fromServiceResponse($sr);
    }

    public function destroy(int $id)
    {
        $admin = $this->service->find($id);
        if (! $admin) {
            return $this->error('Admin not found', 404);
        }

        $this->service->delete($id);

        return $this->success(null, 'Admin deleted', 200);
    }
}
