<?php

namespace App\Repositories;

use Spatie\Permission\Models\Permission;
use Illuminate\Database\Eloquent\Collection;

class PermissionRepository
{
    public function __construct(
        protected Permission $model
    ) {}

    /**
     * Get all permission names
     */
    public function getAllNames(): array
    {
        return $this->model->pluck('name')->toArray();
    }

    /**
     * Get all permissions
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * Get valid permission names from a list
     */
    public function getValidNames(array $permissionNames): array
    {
        return $this->model->whereIn('name', $permissionNames)
            ->pluck('name')
            ->toArray();
    }

    /**
     * Find permission by name
     */
    public function findByName(string $name): ?Permission
    {
        return $this->model->where('name', $name)->first();
    }

    /**
     * Find permission by ID
     */
    public function findById(int $id): ?Permission
    {
        return $this->model->find($id);
    }

    /**
     * Create a new permission
     */
    public function create(array $data): Permission
    {
        return $this->model->create($data);
    }

    /**
     * Get permissions by guard
     */
    public function getByGuard(string $guard = 'admin'): Collection
    {
        return $this->model->where('guard_name', $guard)->get();
    }
}
