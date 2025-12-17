<?php

namespace App\Repositories;

use App\Models\VendorBankAccount;
use App\Repositories\Interfaces\VendorBankAccountRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VendorBankAccountRepository extends EloquentBaseRepository implements VendorBankAccountRepositoryInterface
{
    public function __construct(VendorBankAccount $model)
    {
        parent::__construct($model);
    }

    public function findById(int $id): ?VendorBankAccount
    {
        return $this->model->find($id);
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
