<?php

namespace App\Services;

use App\Repositories\AdminRepository;
use App\Core\ServiceResponse;
use App\Models\VendorPayout;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminService extends BaseService
{
    protected AdminRepository $repo;

    public function __construct(AdminRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list(int $perPage = 15)
    {
        // Eager load roles to ensure they are available in the resource
        return $this->repo->paginateWithRoles($perPage);
    }

    public function find(int $id)
    {
        return $this->repo->find($id);
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    /**
     * Create admin and assign roles (array of role names).
     */
    public function createWithRoles(array $data, array $roles = []): ServiceResponse
    {
        $admin = $this->create($data);

        if (!$admin) {
            return $this->errorResponse('Could not create admin', 500);
        }

        if (!empty($roles)) {
            $admin->syncRoles($roles);
            $admin->primary_role = $roles[0] ?? null;
            $admin->save();
        }

        return $this->successResponse($admin, 'Admin created', 201);
    }

    /**
     * Return a ServiceResponse-wrapped paginated admin list for admin UI
     */
    public function listForAdminResponse(int $perPage = 15): ServiceResponse
    {
        $paginator = $this->list($perPage);

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

    /**
     * Update admin roles and active status
     */
    public function updateRolesAndStatus(int $id, array $roles = [], ?bool $isActive = null): ServiceResponse
    {
        $admin = $this->find($id);
        if (!$admin) {
            return $this->errorResponse('Admin not found', 404);
        }

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
        $admin = $this->find($adminId);
        if (!$admin) {
            return $this->errorResponse('Admin not found', 404);
        }

        $all = \Spatie\Permission\Models\Permission::all()->map(fn($p) => $p->name)->toArray();
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
        $admin = $this->find($adminId);
        if (!$admin) {
            return $this->errorResponse('Admin not found', 404);
        }

        // Validate provided permission names exist; ignore unknown names
        $valid = \Spatie\Permission\Models\Permission::whereIn('name', $permissions)->pluck('name')->toArray();

        // syncDirectPermissions ensures explicit permissions are set on model
        $admin->syncPermissions($valid);

        return $this->successResponse(['permissions' => $admin->getAllPermissions()->pluck('name')], 'Permissions updated');
    }

    /**
     * List vendor payouts for admin (paginated)
     */
    public function listVendorPayouts(int $perPage = 15)
    {
        $paginator = VendorPayout::with('vendor')->orderByDesc('created_at')->paginate($perPage);

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
        $payout = VendorPayout::with('vendor')->find($id);
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
            $payout = VendorPayout::with('vendor')->lockForUpdate()->find($payoutId);
            if (!$payout) {
                return $this->errorResponse('Payout not found', 404);
            }

            // simple state change; admins may want to record reviewer/admin in audit later
            $payout->status = $status;
            if ($status === 'processed') {
                $payout->processed_at = now();
            }
            $payout->save();

            // Log admin action (no DB/audit table created per project request)
            Log::info('admin updated payout status', [
                'admin_id' => $adminId,
                'vendor_id' => $payout->vendor_id,
                'payout_id' => $payout->id,
                'old_status' => $payout->getOriginal('status'),
                'new_status' => $payout->status,
            ]);

            return $this->successResponse($payout, 'Payout updated');
        });
    }
}
