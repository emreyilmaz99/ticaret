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

        if (! $admin) {
            return (new ServiceResponse())->setSuccess(false)->setStatusCode(500)->setMessage('Could not create admin');
        }

        if (! empty($roles)) {
            $admin->syncRoles($roles);
            $admin->primary_role = $roles[0] ?? null;
            $admin->save();
        }

        return (new ServiceResponse())->setSuccess(true)->setStatusCode(201)->setMessage('Admin created')->setData($admin);
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

        return (new ServiceResponse())
            ->setSuccess(true)
            ->setStatusCode(200)
            ->setMessage('Admins listed')
            ->setData($data);
    }

    /**
     * Update admin roles and active status
     */
    public function updateRolesAndStatus(int $id, array $roles = [], ?bool $isActive = null): ServiceResponse
    {
        $admin = $this->find($id);
        if (! $admin) {
            return (new ServiceResponse())->setSuccess(false)->setStatusCode(404)->setMessage('Admin not found');
        }

        if ($isActive !== null) {
            $admin->is_active = (bool) $isActive;
        }

        if (! empty($roles)) {
            $admin->syncRoles($roles);
            $admin->primary_role = $roles[0] ?? null;
        }

        $admin->save();

        return (new ServiceResponse())->setSuccess(true)->setStatusCode(200)->setMessage('Admin updated')->setData($admin);
    }

    /**
     * List all permissions and mark which ones are assigned to the given admin.
     */
    public function listPermissionsForAdmin(int $adminId): ServiceResponse
    {
        $admin = $this->find($adminId);
        if (! $admin) {
            return (new ServiceResponse())->setSuccess(false)->setStatusCode(404)->setMessage('Admin not found');
        }

        $all = \Spatie\Permission\Models\Permission::all()->map(fn($p) => $p->name)->toArray();
        $assigned = $admin->getAllPermissions()->pluck('name')->toArray();

        $list = array_map(function ($name) use ($assigned) {
            return ['name' => $name, 'assigned' => in_array($name, $assigned)];
        }, $all);

        return (new ServiceResponse())->setSuccess(true)->setStatusCode(200)->setMessage('Permissions fetched')->setData(['permissions' => $list]);
    }

    /**
     * Update the permissions assigned to an admin (sync).
     * Expects array of permission names.
     */
    public function updateAdminPermissions(int $adminId, array $permissions): ServiceResponse
    {
        $admin = $this->find($adminId);
        if (! $admin) {
            return (new ServiceResponse())->setSuccess(false)->setStatusCode(404)->setMessage('Admin not found');
        }

        // Validate provided permission names exist; ignore unknown names
        $valid = \Spatie\Permission\Models\Permission::whereIn('name', $permissions)->pluck('name')->toArray();

        // syncDirectPermissions ensures explicit permissions are set on model
        $admin->syncPermissions($valid);

        return (new ServiceResponse())->setSuccess(true)->setStatusCode(200)->setMessage('Permissions updated')->setData(['permissions' => $admin->getAllPermissions()->pluck('name')]);
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

        return (new ServiceResponse())->setSuccess(true)->setStatusCode(200)->setMessage('Payouts listed')->setData($data);
    }

    public function findPayout(int $id): ServiceResponse
    {
        $payout = VendorPayout::with('vendor')->find($id);
        if (! $payout) {
            return (new ServiceResponse())->setSuccess(false)->setStatusCode(404)->setMessage('Payout not found');
        }

        return (new ServiceResponse())->setSuccess(true)->setStatusCode(200)->setMessage('Payout fetched')->setData($payout);
    }

    /**
     * Update payout status (approve/reject/processed)
     */
    public function updatePayoutStatus(int $payoutId, string $status, int $adminId): ServiceResponse
    {
        $allowed = ['pending', 'approved', 'rejected', 'processed'];
        if (! in_array($status, $allowed)) {
            return (new ServiceResponse())->setSuccess(false)->setStatusCode(422)->setMessage('Invalid status');
        }

        return DB::transaction(function () use ($payoutId, $status, $adminId) {
            $payout = VendorPayout::with('vendor')->lockForUpdate()->find($payoutId);
            if (! $payout) {
                return (new ServiceResponse())->setSuccess(false)->setStatusCode(404)->setMessage('Payout not found');
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

            return (new ServiceResponse())->setSuccess(true)->setStatusCode(200)->setMessage('Payout updated')->setData($payout);
        });
    }
}
