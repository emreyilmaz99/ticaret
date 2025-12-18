<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Requests\Api\V1\Admin\UpdateAdminPermissionsRequest;
use App\Interfaces\Services\Admin\AdminServiceInterface;
use Illuminate\Http\Request;

class AdminPermissionsController extends BaseAdminController
{
    protected AdminServiceInterface $service;

    public function __construct(AdminServiceInterface $service)
    {
        $this->service = $service;
    }

    // GET /api/v1/admin/admins/{admin}/permissions
    public function index(int $admin)
    {
        $sr = $this->service->listPermissionsForAdmin($admin);
        return $this->fromServiceResponse($sr);
    }

    // PUT /api/v1/admin/admins/{admin}/permissions
    public function update(UpdateAdminPermissionsRequest $request, int $admin)
    {
        $data = $request->validated();
        $permissions = $data['permissions'] ?? [];

        $sr = $this->service->updateAdminPermissions($admin, $permissions);

        return $this->fromServiceResponse($sr);
    }
}
