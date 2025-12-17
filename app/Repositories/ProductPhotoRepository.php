<?php

namespace App\Repositories;

use App\Models\ProductPhoto;
use App\Repositories\Interfaces\ProductPhotoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductPhotoRepository extends EloquentBaseRepository implements ProductPhotoRepositoryInterface
{
    public function __construct(ProductPhoto $model)
    {
        parent::__construct($model);
    }

    public function listByProduct($productId): Collection
    {
        return $this->model->where('product_id', $productId)->orderBy('sort_order')->get();
    }
}
