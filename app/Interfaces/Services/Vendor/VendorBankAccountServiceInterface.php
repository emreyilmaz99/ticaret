<?php

namespace App\Interfaces\Services\Vendor;

interface VendorBankAccountServiceInterface
{
    /**
     * Add bank account
     */
    public function add(int $vendorId, array $data);

    /**
     * List bank accounts
     */
    public function list(int $vendorId);

    /**
     * Update bank account
     */
    public function update(int $vendorId, int $accountId, array $data);

    /**
     * Delete bank account
     */
    public function delete(int $vendorId, int $accountId);

    /**
     * Sync bank accounts
     */
    public function sync(int $vendorId, array $bankAccounts): void;
}
