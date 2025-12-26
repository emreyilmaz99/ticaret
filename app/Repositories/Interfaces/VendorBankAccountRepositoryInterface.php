<?php

namespace App\Repositories\Interfaces;

use App\Models\VendorBankAccount;
use Illuminate\Database\Eloquent\Collection;

interface VendorBankAccountRepositoryInterface
{
    public function create(array $data): VendorBankAccount;
    public function update(int $id, array $data): VendorBankAccount;
    public function findById(int $id): ?VendorBankAccount;
    public function delete(int $id): bool;
    public function findByVendorAndId(int $vendorId, int $accountId): ?VendorBankAccount;
    public function listByVendor(int $vendorId): Collection;
    public function deleteByVendor(int $vendorId, array $exceptIds = []): int;
    public function clearPrimaryForVendor(int $vendorId): int;
    public function findPrimaryForVendor(int $vendorId): ?VendorBankAccount;
}
