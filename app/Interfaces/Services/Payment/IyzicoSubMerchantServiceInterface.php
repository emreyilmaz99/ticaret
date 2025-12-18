<?php

namespace App\Interfaces\Services\Payment;

use App\Models\Vendor;

interface IyzicoSubMerchantServiceInterface
{
    public function createSubMerchant(Vendor $vendor);
    public function updateSubMerchant(Vendor $vendor);
    public function retrieveSubMerchant(Vendor $vendor);
    public function ensureSubMerchantRegistered(Vendor $vendor);
}
