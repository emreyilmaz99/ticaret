<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Resources\Api\V1\Admin\AdminResource;
use App\Interfaces\Services\Admin\AdminServiceInterface;
use Illuminate\Http\Request;

class AdminController extends BaseAdminController
{
    protected AdminServiceInterface $service;

    public function __construct(AdminServiceInterface $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);

        return $this->fromServiceResponse($this->service->list($perPage));
    }

    public function show(string|int $id)
    {
        return $this->fromServiceResponse($this->service->find((int)$id));
    }

    public function store(\App\Http\Requests\Api\V1\Admin\StoreAdminRequest $request)
    {
        $data = $request->validated();
        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        return $this->fromServiceResponse($this->service->createWithRoles($data, $roles));
    }

    public function update(Request $request, string $id)
    {
        $data = $request->validated();
        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        // Update basic fields first
        $updateResult = $this->service->update((int)$id, $data);
        
        if (!$updateResult->isSuccess()) {
            return $this->fromServiceResponse($updateResult);
        }

        // Then update roles and status
        return $this->fromServiceResponse(
            $this->service->updateRolesAndStatus((int)$id, $roles, $data['is_active'] ?? null)
        );
    }

    public function destroy(string|int $id)
    {
        return $this->fromServiceResponse($this->service->delete((int)$id));
    }
}
