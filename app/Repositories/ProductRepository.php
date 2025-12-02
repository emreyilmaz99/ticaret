<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository extends EloquentBaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function findForVendor(int $vendorId, $productId): ?Product
    {
        return $this->model->where('id', $productId)->where('vendor_id', $vendorId)->first();
    }

    public function findById($id): ?Product
    {
        return $this->model->find($id);
    }

    public function listForVendor(int $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        // eager-load category so API resources can include category data without N+1
        return $this->model->with(['photos','variants','tags','category'])
            ->where('vendor_id', $vendorId)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function existsBySlug(string $slug): bool
    {
        return $this->model->where('slug', $slug)->exists();
    }

    public function create(array $data): Product
    {
        /** @var Product */
        return parent::create($data);
    }

    public function update($id, array $data): Product
    {
        /** @var Product */
        return parent::update($id, $data);
    }
}
