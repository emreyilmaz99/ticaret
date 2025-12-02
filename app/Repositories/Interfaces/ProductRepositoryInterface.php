<?php

namespace App\Repositories\Interfaces;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function create(array $data): Product;
    public function update($id, array $data): Product;
    public function findById($id): ?Product;
    public function delete($id): bool;
    public function findForVendor(int $vendorId, $productId): ?Product;
    public function listForVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator;
    public function existsBySlug(string $slug): bool;
}
