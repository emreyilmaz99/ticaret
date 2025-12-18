<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorAddressServiceInterface;
use App\Services\BaseService;
use App\Repositories\Interfaces\VendorAddressRepositoryInterface;

class VendorAddressService extends BaseService implements VendorAddressServiceInterface
{
    protected VendorAddressRepositoryInterface $addressRepo;

    public function __construct(VendorAddressRepositoryInterface $addressRepo)
    {
        $this->addressRepo = $addressRepo;
    }

    /**
     * Adres ekle
     */
    public function add(int $vendorId, array $data)
    {
        if (!empty($data['is_primary'])) {
            $this->addressRepo->clearPrimaryForVendor($vendorId);
        }

        $data['vendor_id'] = $vendorId;
        return $this->addressRepo->create($data);
    }

    /**
     * Adresleri listele
     */
    public function list(int $vendorId)
    {
        return $this->addressRepo->listByVendor($vendorId);
    }

    /**
     * Adres güncelle
     */
    public function update(int $vendorId, int $addressId, array $data)
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

    /**
     * Adres sil
     */
    public function delete(int $vendorId, int $addressId)
    {
        $address = $this->addressRepo->findByVendorAndId($vendorId, $addressId);

        if (!$address) {
            throw new \Exception('Address not found');
        }

        return $this->addressRepo->delete($addressId);
    }

    /**
     * Adresleri senkronize et (toplu güncelleme için)
     */
    public function sync(int $vendorId, array $addresses): void
    {
        $keepIds = collect($addresses)->pluck('id')->filter()->toArray();
        $this->addressRepo->deleteByVendor($vendorId, $keepIds);

        foreach ($addresses as $addrData) {
            if (isset($addrData['id'])) {
                $this->addressRepo->update($addrData['id'], $addrData);
            } else {
                $addrData['vendor_id'] = $vendorId;
                $this->addressRepo->create($addrData);
            }
        }
    }
}
