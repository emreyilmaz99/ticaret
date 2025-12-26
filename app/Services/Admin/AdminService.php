<?php

namespace App\Services\Admin;

use App\Interfaces\Services\Admin\AdminServiceInterface;
use App\Repositories\AdminRepository;
use App\Repositories\VendorPayoutRepository;
use App\Repositories\PermissionRepository;
use App\Core\ServiceResponse;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminService extends BaseService implements AdminServiceInterface
{
    public function __construct(
        protected AdminRepository $repo,
        protected VendorPayoutRepository $vendorPayoutRepository,
        protected PermissionRepository $permissionRepository
    ) {}

    public function list(int $perPage = 15): ServiceResponse
    {
        $paginator = $this->repo->paginateWithRoles($perPage);
        
        $data = [
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        return $this->successResponse($data, 'Admins listed');
    }

    public function find(int $id): ServiceResponse
    {
        $admin = $this->repo->find($id);
        
        if (!$admin) {
            return $this->errorResponse('Admin not found', 404);
        }

        return $this->successResponse($admin, 'Admin found');
    }

    public function getCurrentAdmin($admin): ServiceResponse
    {
        return $this->find($admin->id);
    }

    public function create(array $data): ServiceResponse
    {
        $admin = $this->repo->create($data);
        
        if (!$admin) {
            return $this->errorResponse('Could not create admin', 500);
        }

        return $this->successResponse($admin, 'Admin created', 201);
    }

    public function update(int $id, array $data): ServiceResponse
    {
        $admin = $this->repo->find($id);
        
        if (!$admin) {
            return $this->errorResponse('Admin not found', 404);
        }
        
        $updated = $this->repo->update($id, $data);
        
        return $this->successResponse($updated, 'Admin updated');
    }

    public function delete(int $id): ServiceResponse
    {
        $admin = $this->repo->find($id);
        
        if (!$admin) {
            return $this->errorResponse('Admin not found', 404);
        }
        
        $this->repo->delete($id);

        return $this->successResponse(null, 'Admin deleted');
    }

    /**
     * Create admin and assign roles (array of role names).
     */
    public function createWithRoles(array $data, array $roles = []): ServiceResponse
    {
        $createResult = $this->create($data);
        
        if (!$createResult->isSuccess()) {
            return $createResult;
        }
        
        $admin = $createResult->getData();

        if (!empty($roles)) {
            $admin->syncRoles($roles);
            $admin->primary_role = $roles[0] ?? null;
            $admin->save();
        }

        return $this->successResponse($admin, 'Admin created with roles', 201);
    }

    /**
     * Return a ServiceResponse-wrapped paginated admin list for admin UI
     */
    public function listForAdminResponse(int $perPage = 15): ServiceResponse
    {
        return $this->list($perPage);
    }

    /**
     * Update admin roles and active status
     */
    public function updateRolesAndStatus(int $id, array $roles = [], ?bool $isActive = null): ServiceResponse
    {
        $findResult = $this->find($id);
        if (!$findResult->isSuccess()) {
            return $findResult;
        }
        
        $admin = $findResult->getData();

        if ($isActive !== null) {
            $admin->is_active = (bool) $isActive;
        }

        if (!empty($roles)) {
            $admin->syncRoles($roles);
            $admin->primary_role = $roles[0] ?? null;
        }

        $admin->save();

        return $this->successResponse($admin, 'Admin updated');
    }

    /**
     * List all permissions and mark which ones are assigned to the given admin.
     */
    public function listPermissionsForAdmin(int $adminId): ServiceResponse
    {
        $findResult = $this->find($adminId);
        if (!$findResult->isSuccess()) {
            return $findResult;
        }
        
        $admin = $findResult->getData();

        $all = $this->permissionRepository->getAllNames();
        $assigned = $admin->getAllPermissions()->pluck('name')->toArray();

        $list = array_map(function ($name) use ($assigned) {
            return ['name' => $name, 'assigned' => in_array($name, $assigned)];
        }, $all);

        return $this->successResponse(['permissions' => $list], 'Permissions fetched');
    }

    /**
     * Update the permissions assigned to an admin (sync).
     * Expects array of permission names.
     */
    public function updateAdminPermissions(int $adminId, array $permissions): ServiceResponse
    {
        $findResult = $this->find($adminId);
        if (!$findResult->isSuccess()) {
            return $findResult;
        }
        
        $admin = $findResult->getData();

        // Validate provided permission names exist; ignore unknown names
        $valid = $this->permissionRepository->getValidNames($permissions);

        // syncDirectPermissions ensures explicit permissions are set on model
        $admin->syncPermissions($valid);

        return $this->successResponse(['permissions' => $admin->getAllPermissions()->pluck('name')], 'Permissions updated');
    }

    /**
     * List vendor payouts for admin (paginated)
     */
    public function listVendorPayouts(int $perPage = 15)
    {
        $paginator = $this->vendorPayoutRepository->paginateWithVendor($perPage);

        $data = [
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        return $this->successResponse($data, 'Payouts listed');
    }

    public function findPayout(int $id): ServiceResponse
    {
        $payout = $this->vendorPayoutRepository->findWithVendor($id);
        if (!$payout) {
            return $this->errorResponse('Payout not found', 404);
        }

        return $this->successResponse($payout, 'Payout fetched');
    }

    /**
     * Update payout status (approve/reject/processed)
     */
    public function updatePayoutStatus(int $payoutId, string $status, int $adminId): ServiceResponse
    {
        $allowed = ['pending', 'approved', 'rejected', 'processed'];
        if (!in_array($status, $allowed)) {
            return $this->errorResponse('Invalid status', 422);
        }

        return DB::transaction(function () use ($payoutId, $status, $adminId) {
            $payout = $this->vendorPayoutRepository->findWithVendorForUpdate($payoutId);
            if (!$payout) {
                return $this->errorResponse('Payout not found', 404);
            }

            $oldStatus = $payout->status;
            
            // Update status via repository
            $processedAt = $status === 'processed' ? now()->toDateTimeString() : null;
            $this->vendorPayoutRepository->updateStatus($payoutId, $status, $processedAt);
            
            $payout->refresh();

            // Log admin action (no DB/audit table created per project request)
            Log::info('admin updated payout status', [
                'admin_id' => $adminId,
                'vendor_id' => $payout->vendor_id,
                'payout_id' => $payout->id,
                'old_status' => $oldStatus,
                'new_status' => $payout->status,
            ]);

            return $this->successResponse($payout, 'Payout updated');
        });
    }
}
