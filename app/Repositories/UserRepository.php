<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends EloquentBaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Paginate users with filters and search
     */
    public function paginateWithFilters(int $perPage = 15, array $filters = [])
    {
        $query = $this->model->withCount('addresses');

        // Search by name, email, phone
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Filter by gender
        if (!empty($filters['gender'])) {
            $query->where('gender', $filters['gender']);
        }

        // Filter by email verification
        if (isset($filters['email_verified'])) {
            if ($filters['email_verified']) {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
        }

        // Sort
        $sortField = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $allowedSorts = ['id', 'name', 'email', 'created_at', 'last_login_at'];
        
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    /**
     * Find user with all relations
     */
    public function findWithRelations(int $id)
    {
        return $this->model
            ->with(['addresses', 'roles'])
            ->withCount('addresses')
            ->find($id);
    }
}
