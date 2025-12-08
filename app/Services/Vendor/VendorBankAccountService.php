<?php

namespace App\Services\Vendor;

use App\Services\BaseService;
use App\Repositories\Interfaces\VendorBankAccountRepositoryInterface;

class VendorBankAccountService extends BaseService
{
    protected VendorBankAccountRepositoryInterface $bankRepo;

    public function __construct(VendorBankAccountRepositoryInterface $bankRepo)
    {
        $this->bankRepo = $bankRepo;
    }

    /**
     * Banka hesabı ekle
     */
    public function add(int $vendorId, array $data)
    {
        if (!empty($data['is_primary'])) {
            $this->bankRepo->clearPrimaryForVendor($vendorId);
        }

        $data['vendor_id'] = $vendorId;
        return $this->bankRepo->create($data);
    }

    /**
     * Banka hesaplarını listele
     */
    public function list(int $vendorId)
    {
        return $this->bankRepo->listByVendor($vendorId);
    }

    /**
     * Banka hesabı güncelle
     */
    public function update(int $vendorId, int $accountId, array $data)
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

    /**
     * Banka hesabı sil
     */
    public function delete(int $vendorId, int $accountId)
    {
        $account = $this->bankRepo->findByVendorAndId($vendorId, $accountId);

        if (!$account) {
            throw new \Exception('Bank account not found');
        }

        return $this->bankRepo->delete($accountId);
    }

    /**
     * Banka hesaplarını senkronize et (toplu güncelleme için)
     */
    public function sync(int $vendorId, array $bankAccounts): void
    {
        $keepIds = collect($bankAccounts)->pluck('id')->filter()->toArray();
        $this->bankRepo->deleteByVendor($vendorId, $keepIds);

        foreach ($bankAccounts as $bankData) {
            if (isset($bankData['id'])) {
                $this->bankRepo->update($bankData['id'], $bankData);
            } else {
                $bankData['vendor_id'] = $vendorId;
                $this->bankRepo->create($bankData);
            }
        }
    }
}
