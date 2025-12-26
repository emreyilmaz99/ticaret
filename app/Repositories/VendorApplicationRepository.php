<?php

namespace App\Repositories;

use App\Models\VendorApplication;
use App\Repositories\Interfaces\VendorApplicationRepositoryInterface;

class VendorApplicationRepository extends EloquentBaseRepository implements VendorApplicationRepositoryInterface
{
    public function __construct(VendorApplication $model)
    {
        parent::__construct($model);
    }

    /**
     * Get pending pre-applications
     */
    public function getPendingPreApplications()
    {
        return $this->model
            ->preApplication()
            ->pending()
            ->with('reviewer')
            ->latest()
            ->paginate(15);
    }

    /**
     * Get pending full applications
     */
    public function getPendingFullApplications()
    {
        return $this->model
            ->fullApplication()
            ->pending()
            ->with('reviewer')
            ->latest()
            ->paginate(15);
    }

    /**
     * Find application by email
     */
    public function findByEmail(string $email)
    {
        return $this->model->where('email', $email)->latest()->first();
    }

    /**
     * Find pre-application by email
     */
    public function findPreApplicationByEmail(string $email)
    {
        return $this->model
            ->where('email', $email)
            ->where('type', 'pre_application')
            ->latest()
            ->first();
    }

    /**
     * Get applications by status
     */
    public function getByStatus(string $status, int $perPage = 15)
    {
        return $this->model
            ->where('status', $status)
            ->with(['reviewer', 'vendor'])
            ->latest()
            ->paginate($perPage);
    }
}
