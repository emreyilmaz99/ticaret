<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorServiceInterface;
use App\Services\BaseService;
use App\Repositories\VendorRepository;
use App\Services\Vendor\VendorAddressService;
use App\Services\Vendor\VendorBankAccountService;
use App\Core\ServiceResponse;
use Illuminate\Support\Facades\DB;

class VendorService extends BaseService implements VendorServiceInterface
{
    public function __construct(
        protected VendorRepository $repo,
        protected VendorAddressService $addressService,
        protected VendorBankAccountService $bankAccountService
    ) {}

    // ==================== CRUD Operations ====================

    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function listOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at'])
    {
        return $this->repo->paginateOptimized($perPage, $filters, $select);
    }

    public function find(int $id)
    {
        return $this->repo->find($id);
    }

    public function findWithStats(int $id)
    {
        return $this->repo->findWithStats($id);
    }

    public function getCurrentVendor($vendor)
    {
        return $this->find($vendor->id);
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, array $data): ServiceResponse
    {
        try {
            DB::beginTransaction();

            // Update basic vendor info (excluding file uploads - those should be handled by MediaService)
            $cleanData = array_diff_key($data, array_flip(['logo_file', 'cover_file', 'addresses', 'bank_accounts']));
            $vendor = $this->repo->update($id, $cleanData);

            // Sync addresses if provided
            if (isset($data['addresses']) && is_array($data['addresses'])) {
                $this->addressService->sync($id, $data['addresses']);
            }

            // Sync bank accounts if provided
            if (isset($data['bank_accounts']) && is_array($data['bank_accounts'])) {
                $this->bankAccountService->sync($id, $data['bank_accounts']);
            }

            DB::commit();

            return $this->successResponse($vendor, 'Satıcı başarıyla güncellendi');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e, 'Satıcı güncellenemedi');
        }
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    // ==================== Backward Compatibility (Facade Pattern) ====================

    /**
     * @deprecated Use VendorAddressService::add() instead
     */
    public function addAddress(int $vendorId, array $data)
    {
        return $this->addressService->add($vendorId, $data);
    }

    /**
     * @deprecated Use VendorAddressService::list() instead
     */
    public function listAddresses(int $vendorId)
    {
        return $this->addressService->list($vendorId);
    }

    /**
     * @deprecated Use VendorAddressService::update() instead
     */
    public function updateAddress(int $vendorId, int $addressId, array $data)
    {
        return $this->addressService->update($vendorId, $addressId, $data);
    }

    /**
     * @deprecated Use VendorAddressService::delete() instead
     */
    public function deleteAddress(int $vendorId, int $addressId)
    {
        return $this->addressService->delete($vendorId, $addressId);
    }

    /**
     * @deprecated Use VendorBankAccountService::add() instead
     */
    public function addBankAccount(int $vendorId, array $data)
    {
        return $this->bankAccountService->add($vendorId, $data);
    }

    /**
     * @deprecated Use VendorBankAccountService::list() instead
     */
    public function listBankAccounts(int $vendorId)
    {
        return $this->bankAccountService->list($vendorId);
    }

    /**
     * @deprecated Use VendorBankAccountService::update() instead
     */
    public function updateBankAccount(int $vendorId, int $accountId, array $data)
    {
        return $this->bankAccountService->update($vendorId, $accountId, $data);
    }

    /**
     * @deprecated Use VendorBankAccountService::delete() instead
     */
    public function deleteBankAccount(int $vendorId, int $accountId)
    {
        return $this->bankAccountService->delete($vendorId, $accountId);
    }
}
