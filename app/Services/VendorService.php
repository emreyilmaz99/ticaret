<?php

namespace App\Services;

use App\Repositories\VendorRepository;
use App\Repositories\Interfaces\VendorAddressRepositoryInterface;
use App\Repositories\Interfaces\VendorBankAccountRepositoryInterface;
use App\Repositories\Interfaces\VendorPayoutRepositoryInterface;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class VendorService extends BaseService
{
    protected VendorRepository $repo;
    protected VendorAddressRepositoryInterface $addressRepo;
    protected VendorBankAccountRepositoryInterface $bankRepo;
    protected VendorPayoutRepositoryInterface $payoutRepo;

    public function __construct(
        VendorRepository $repo,
        VendorAddressRepositoryInterface $addressRepo,
        VendorBankAccountRepositoryInterface $bankRepo,
        VendorPayoutRepositoryInterface $payoutRepo
    ) {
        $this->repo = $repo;
        $this->addressRepo = $addressRepo;
        $this->bankRepo = $bankRepo;
        $this->payoutRepo = $payoutRepo;
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
        // Use Eloquent to load relations and aggregates
        $paginator = Vendor::with(['addresses' => function($q) {
                $q->where('is_primary', true);
            }, 'bankAccounts' => function($q) {
                $q->where('is_primary', true);
            }])
            ->withSum('payouts', 'amount') // Calculate total revenue
            ->latest()
            ->paginate($perPage);

        $data = [
            'data' => \App\Http\Resources\Api\V1\Admin\VendorResource::collection($paginator),
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
        return DB::transaction(function () use ($id, $data) {
            // handle file uploads if provided as UploadedFile instances
            if (! empty($data['logo_file']) && $data['logo_file'] instanceof UploadedFile) {
                $path = $data['logo_file']->store("vendors/{$id}", 'public');
                $data['logo_path'] = $path;
                unset($data['logo_file']);
            }

            if (! empty($data['cover_file']) && $data['cover_file'] instanceof UploadedFile) {
                $path = $data['cover_file']->store("vendors/{$id}", 'public');
                $data['cover_path'] = $path;
                unset($data['cover_file']);
            }

            // 1. Update basic info
            $vendor = $this->repo->update($id, $data);

            // 2. Sync Addresses if provided
            if (isset($data['addresses']) && is_array($data['addresses'])) {
                // Strategy: Delete all and recreate, or update existing?
                // For simplicity in this "Edit Modal" context, we can update/create.
                // But to handle deletions, "sync" logic is better.
                // Let's assume the frontend sends the FULL list of desired state.
                
                // Get IDs of addresses to keep
                $keepIds = collect($data['addresses'])->pluck('id')->filter()->toArray();
                
                // Delete removed addresses
                $this->addressRepo->deleteByVendor($id, $keepIds);

                foreach ($data['addresses'] as $addrData) {
                    if (isset($addrData['id'])) {
                        $this->addressRepo->update($addrData['id'], $addrData);
                    } else {
                        $addrData['vendor_id'] = $id;
                        $this->addressRepo->create($addrData);
                    }
                }
            }

            // 3. Sync Bank Accounts if provided
            if (isset($data['bank_accounts']) && is_array($data['bank_accounts'])) {
                $keepIds = collect($data['bank_accounts'])->pluck('id')->filter()->toArray();
                $this->bankRepo->deleteByVendor($id, $keepIds);

                foreach ($data['bank_accounts'] as $bankData) {
                    if (isset($bankData['id'])) {
                        $this->bankRepo->update($bankData['id'], $bankData);
                    } else {
                        $bankData['vendor_id'] = $id;
                        $this->bankRepo->create($bankData);
                    }
                }
            }

            return $vendor;
        });
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
            $this->addressRepo->clearPrimaryForVendor($vendorId);
        }

        $data['vendor_id'] = $vendorId;
        return $this->addressRepo->create($data);
    }

    public function listAddresses(int $vendorId)
    {
        return $this->addressRepo->listByVendor($vendorId);
    }

    /**
     * Bank accounts
     */
    public function addBankAccount(int $vendorId, array $data)
    {
        if (!empty($data['is_primary'])) {
            $this->bankRepo->clearPrimaryForVendor($vendorId);
        }

        $data['vendor_id'] = $vendorId;
        return $this->bankRepo->create($data);
    }

    public function listBankAccounts(int $vendorId)
    {
        return $this->bankRepo->listByVendor($vendorId);
    }

    public function updateAddress(int $vendorId, int $addressId, array $data)
    {
        $address = $this->addressRepo->findByVendorAndId($vendorId, $addressId);
        
        if (!$address) {
            throw new \Exception('Address not found');
        }

        if (!empty($data['is_primary'])) {
            $this->addressRepo->clearPrimaryForVendor($vendorId);
        }

        return $this->addressRepo->update($addressId, $data);
    }

    public function deleteAddress(int $vendorId, int $addressId)
    {
        $address = $this->addressRepo->findByVendorAndId($vendorId, $addressId);
        
        if (!$address) {
            throw new \Exception('Address not found');
        }
        
        return $this->addressRepo->delete($addressId);
    }

    public function updateBankAccount(int $vendorId, int $accountId, array $data)
    {
        $account = $this->bankRepo->findByVendorAndId($vendorId, $accountId);
        
        if (!$account) {
            throw new \Exception('Bank account not found');
        }

        if (!empty($data['is_primary'])) {
            $this->bankRepo->clearPrimaryForVendor($vendorId);
        }

        return $this->bankRepo->update($accountId, $data);
    }

    public function deleteBankAccount(int $vendorId, int $accountId)
    {
        $account = $this->bankRepo->findByVendorAndId($vendorId, $accountId);
        
        if (!$account) {
            throw new \Exception('Bank account not found');
        }
        
        return $this->bankRepo->delete($accountId);
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

            $payout = $this->payoutRepo->create([
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
        return $this->payoutRepo->listByVendor($vendorId);
    }

    public function getBalance(int $vendorId)
    {
        $vendor = Vendor::findOrFail($vendorId);
        return $vendor->balance;
    }
}
