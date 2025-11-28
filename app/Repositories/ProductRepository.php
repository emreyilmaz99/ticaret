<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository extends EloquentBaseRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function findForVendor(string $vendorId, $productId): ?Product
    {
        return $this->model->where('id', $productId)->where('vendor_id', $vendorId)->first();
    }

    public function findById($id): ?Product
    {
        return $this->model->find($id);
    }

    public function listForVendor(string $vendorId, int $perPage = 15): LengthAwarePaginator
    {
        // eager-load category so API resources can include category data without N+1
        return $this->model->with(['photos','variants','tags','category'])->where('vendor_id', $vendorId)->orderByDesc('created_at')->paginate($perPage);
    }
}
