<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository extends EloquentBaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    public function update($idOrUser, array $data): User
    {
        if ($idOrUser instanceof User) {
            $idOrUser->update($data);
            return $idOrUser->fresh();
        }
        
        $record = $this->model->findOrFail($idOrUser);
        $record->update($data);
        return $record;
    }

    /**
     * Find user by ID
     */
    public function findById($id): ?User
    {
        return $this->model->find($id);
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus(int $id): bool
    {
        $user = $this->model->find($id);
        if (!$user) {
            return false;
        }
        $user->is_active = !$user->is_active;
        $user->save();
        return true;
    }

    /**
     * Paginate users with filters and search
     */
    public function paginateWithFilters(int $perPage = 15, array $filters = []): \Illuminate\Contracts\Pagination\LengthAwarePaginator
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
    public function findWithRelations(int $id): ?User
    {
        return $this->model
            ->with(['addresses', 'roles'])
            ->withCount('addresses')
            ->find($id);
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Update user's last login timestamp
     */
    public function updateLastLogin(int $id): void
    {
        $this->model->where('id', $id)->update(['last_login_at' => now()]);
    }

    /**
     * Find user with addresses
     */
    public function findWithAddresses(int $id): ?User
    {
        return $this->model
            ->with(['addresses', 'defaultAddress'])
            ->find($id);
    }
}
