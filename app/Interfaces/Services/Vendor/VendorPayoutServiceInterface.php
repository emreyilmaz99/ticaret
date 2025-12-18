<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;

interface VendorPayoutServiceInterface
{
    /**
     * Request payout
     */
    public function request(int $vendorId, float $amount, array $options = []);

    /**
     * List vendor payouts
     */
    public function list(int $vendorId);

    /**
     * Get vendor balance
     */
    public function getBalance(int $vendorId): float;

    /**
     * Update payout status
     */
    public function updateStatus(int $payoutId, string $status, ?int $adminId = null);

    /**
     * List all payouts (admin)
     */
    public function listAll(int $perPage = 15);

    /**
     * Find payout by ID
     */
    public function find(int $payoutId);
}
