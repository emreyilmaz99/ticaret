<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Vendor;
use App\Repositories\ProductRepository;

class ProductService
{
    protected ProductRepository $repo;

    public function __construct(ProductRepository $repo)
    {
        $this->repo = $repo;
    }

    public function createForVendor(Vendor $vendor, array $data): Product
    {
        // ensure vendor ownership
        $data['vendor_id'] = $vendor->id;
        // vendor-created products default to pending
        $data['status'] = $data['status'] ?? 'pending';

        return $this->repo->create($data);
    }

    public function updateForVendor(Vendor $vendor, Product $product, array $data): Product
    {
        // prevent changing vendor_id
        unset($data['vendor_id']);
        return $this->repo->update($product, $data);
    }

    public function listForVendor(Vendor $vendor, int $perPage = 15)
    {
        return $this->repo->listForVendor($vendor->id, $perPage);
    }

    public function deleteForVendor(Vendor $vendor, Product $product): void
    {
        $this->repo->delete($product);
    }
}
