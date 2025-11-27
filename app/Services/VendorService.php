<?php

namespace App\Services;

use App\Repositories\VendorRepository;
use App\Models\Vendor;
use App\Models\VendorAddress;
use App\Models\VendorBankAccount;
use App\Models\VendorPayout;
use Illuminate\Support\Facades\DB;

class VendorService extends BaseService
{
    protected VendorRepository $repo;

    public function __construct(VendorRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    /**
     * Return a paginated, optimized list that uses Query Builder to avoid Eloquent model hydration.
     * Useful for large lists where only a few columns are needed.
     *
     * @param int $perPage
     * @param array $filters
     * @param array $select
     * @return mixed
     */
    public function listOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at'])
    {
        return $this->repo->paginateOptimized($perPage, $filters, $select);
    }

    /**
     * Wrapper that returns a ServiceResponse compatible payload for admin listing.
     */
    public function listForAdminResponse(int $perPage = 15)
    {
        $paginator = $this->listOptimized($perPage);

        $data = [
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)
           ->setStatusCode(200)
           ->setMessage('Satıcılar listelendi')
           ->setData($data);

        return $sr;
    }

    public function find(int $id)
    {
        return $this->repo->find($id);
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    /**
     * Addresses
     */
    public function addAddress(int $vendorId, array $data)
    {
        if (!empty($data['is_primary'])) {
            VendorAddress::where('vendor_id', $vendorId)->update(['is_primary' => false]);
        }

        $data['vendor_id'] = $vendorId;
        return VendorAddress::create($data);
    }

    public function listAddresses(int $vendorId)
    {
        return VendorAddress::where('vendor_id', $vendorId)->get();
    }

    /**
     * Bank accounts
     */
    public function addBankAccount(int $vendorId, array $data)
    {
        if (!empty($data['is_primary'])) {
            VendorBankAccount::where('vendor_id', $vendorId)->update(['is_primary' => false]);
        }

        $data['vendor_id'] = $vendorId;
        return VendorBankAccount::create($data);
    }

    public function listBankAccounts(int $vendorId)
    {
        return VendorBankAccount::where('vendor_id', $vendorId)->get();
    }

    public function updateAddress(int $vendorId, int $addressId, array $data)
    {
        $address = VendorAddress::where('vendor_id', $vendorId)->where('id', $addressId)->firstOrFail();

        if (!empty($data['is_primary'])) {
            VendorAddress::where('vendor_id', $vendorId)->update(['is_primary' => false]);
        }

        $address->fill($data);
        $address->save();

        return $address;
    }

    public function deleteAddress(int $vendorId, int $addressId)
    {
        $address = VendorAddress::where('vendor_id', $vendorId)->where('id', $addressId)->firstOrFail();
        return $address->delete();
    }

    public function updateBankAccount(int $vendorId, int $accountId, array $data)
    {
        $account = VendorBankAccount::where('vendor_id', $vendorId)->where('id', $accountId)->firstOrFail();

        if (!empty($data['is_primary'])) {
            VendorBankAccount::where('vendor_id', $vendorId)->update(['is_primary' => false]);
        }

        $account->fill($data);
        $account->save();

        return $account;
    }

    public function deleteBankAccount(int $vendorId, int $accountId)
    {
        $account = VendorBankAccount::where('vendor_id', $vendorId)->where('id', $accountId)->firstOrFail();
        return $account->delete();
    }

    /**
     * Payouts
     */
    public function requestPayout(int $vendorId, float $amount, array $options = [])
    {
        return DB::transaction(function () use ($vendorId, $amount, $options) {
            $vendor = Vendor::findOrFail($vendorId);

            $fee = $options['fee'] ?? 0;
            $total = $amount + $fee;

            if ($vendor->balance < $total) {
                throw new \Exception('Yetersiz bakiye');
            }

            $vendor->balance = $vendor->balance - $total;
            $vendor->save();

            $payout = VendorPayout::create([
                'vendor_id' => $vendorId,
                'amount' => $amount,
                'fee' => $fee,
                'method' => $options['method'] ?? null,
                'status' => $options['status'] ?? 'pending',
                'reference' => $options['reference'] ?? null,
            ]);

            return $payout;
        });
    }

    public function listPayouts(int $vendorId)
    {
        return VendorPayout::where('vendor_id', $vendorId)->orderByDesc('created_at')->get();
    }

    public function getBalance(int $vendorId)
    {
        $vendor = Vendor::findOrFail($vendorId);
        return $vendor->balance;
    }
}
