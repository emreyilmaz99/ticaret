<?php

namespace App\Interfaces\Services\Vendor;

interface VendorAddressServiceInterface
{
    /**
     * Add vendor address
     */
    public function add(int $vendorId, array $data);

    /**
     * List vendor addresses
     */
    public function list(int $vendorId);

    /**
     * Update vendor address
     */
    public function update(int $vendorId, int $addressId, array $data);

    /**
     * Delete vendor address
     */
    public function delete(int $vendorId, int $addressId);

    /**
     * Sync vendor addresses
     */
    public function sync(int $vendorId, array $addresses): void;
}
