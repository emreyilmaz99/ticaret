<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;

interface VendorMetadataServiceInterface
{
    public function set(int $vendorId, string $key, string $value): ServiceResponse;
    public function get(int $vendorId, string $key, $default = null);
    public function getAll(int $vendorId): array;
    public function delete(int $vendorId, string $key): ServiceResponse;
    public function setMany(int $vendorId, array $metadata): ServiceResponse;
}
