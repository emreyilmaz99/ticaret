<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository
{
    public function create(array $data): Product
    {
        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product->refresh();
    }

    public function findForVendor(string $vendorId, $productId): ?Product
    {
        return Product::where('id', $productId)->where('vendor_id', $vendorId)->first();
    }

    public function findById($id): ?Product
    {
        return Product::find($id);
    }

    public function listForVendor(string $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        return Product::where('vendor_id', $vendorId)->orderByDesc('created_at')->paginate($perPage);
    }

    public function delete(Product $product): void
    {
        $product->delete();
    }
}
