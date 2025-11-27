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
}
