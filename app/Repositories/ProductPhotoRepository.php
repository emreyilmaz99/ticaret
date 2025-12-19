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

    public function create(array $data): ProductPhoto
    {
        return $this->model->create($data);
    }

    public function update($id, array $data): ProductPhoto
    {
        $record = $this->model->findOrFail($id);
        $record->update($data);
        return $record;
    }

    public function listByProduct($productId): Collection
    {
        return $this->model->where('product_id', $productId)->orderBy('sort_order')->get();
    }
}
