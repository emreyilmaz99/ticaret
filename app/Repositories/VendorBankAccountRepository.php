<?php

namespace App\Repositories;

use App\Models\VendorBankAccount;
use App\Repositories\Interfaces\VendorBankAccountRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VendorBankAccountRepository implements VendorBankAccountRepositoryInterface
{
    protected VendorBankAccount $model;

    public function __construct(VendorBankAccount $model)
    {
        $this->model = $model;
    }

    public function create(array $data): VendorBankAccount
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): VendorBankAccount
    {
        $account = $this->model->findOrFail($id);
        $account->update($data);
        return $account->fresh();
    }

    public function findById(int $id): ?VendorBankAccount
    {
        return $this->model->find($id);
    }

    public function delete(int $id): bool
    {
        $account = $this->model->findOrFail($id);
        return (bool) $account->delete();
    }

    public function findByVendorAndId(int $vendorId, int $accountId): ?VendorBankAccount
    {
        return $this->model->where('vendor_id', $vendorId)
            ->where('id', $accountId)
            ->first();
    }

    public function listByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)->get();
    }

    public function deleteByVendor(int $vendorId, array $exceptIds = []): int
    {
        $query = $this->model->where('vendor_id', $vendorId);
        
        if (!empty($exceptIds)) {
            $query->whereNotIn('id', $exceptIds);
        }
        
        return $query->delete();
    }

    public function clearPrimaryForVendor(int $vendorId): int
    {
        return $this->model->where('vendor_id', $vendorId)
            ->update(['is_primary' => false]);
    }
}
