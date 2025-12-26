<?php

namespace App\Repositories;

use App\Models\Admin;

class AdminRepository extends EloquentBaseRepository
{
    public function __construct(Admin $model)
    {
        parent::__construct($model);
    }

    // Add admin-specific helpers here (search by role, active filters, etc.)

    public function paginateWithRoles(int $perPage = 15)
    {
        return $this->model->with('roles')->paginate($perPage);
    }

    /**
     * Find admin by email with roles
     */
    public function findByEmail(string $email): ?Admin
    {
        return $this->model->with('roles')->where('email', $email)->first();
    }
}
