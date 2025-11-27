<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends EloquentBaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    // Add user-specific query helpers here when needed
}
