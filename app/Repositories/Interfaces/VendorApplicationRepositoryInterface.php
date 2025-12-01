<?php

namespace App\Repositories\Interfaces;

use App\Repositories\BaseRepositoryInterface;

interface VendorApplicationRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get pending pre-applications
     */
    public function getPendingPreApplications();

    /**
     * Get pending full applications
     */
    public function getPendingFullApplications();

    /**
     * Find application by email
     */
    public function findByEmail(string $email);

    /**
     * Get applications by status
     */
    public function getByStatus(string $status, int $perPage = 15);
}
