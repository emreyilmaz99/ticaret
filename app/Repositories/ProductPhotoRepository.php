<?php

namespace App\Repositories;

use App\Models\ProductPhoto;
use App\Repositories\Interfaces\ProductPhotoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductPhotoRepository implements ProductPhotoRepositoryInterface
{
    protected ProductPhoto $model;

    public function __construct(ProductPhoto $model)
    {
        $this->model = $model;
    }

    public function create(array $data): ProductPhoto
    {
        return $this->model->create($data);
    }

    public function delete(int $id): bool
    {
        $photo = $this->model->findOrFail($id);
        return (bool) $photo->delete();
    }

    public function listByProduct($productId): Collection
    {
        return $this->model->where('product_id', $productId)->orderBy('sort_order')->get();
    }
}
