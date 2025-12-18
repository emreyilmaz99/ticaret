<?php

namespace App\Interfaces\Services\Product;

use App\Models\Product;
use App\Models\Vendor;

interface ProductCrudServiceInterface
{
    public function createForVendor(Vendor $vendor, array $data): Product;
    public function update(int $productId, array $data): Product;
    public function delete(int $productId): bool;
    public function updateStatus(int $productId, string $status): Product;
    public function bulkUpdateStatus(array $productIds, string $status): int;
}
