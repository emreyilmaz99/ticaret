<?php

namespace App\Repositories\Interfaces;

use App\Models\ProductPhoto;
use Illuminate\Database\Eloquent\Collection;

interface ProductPhotoRepositoryInterface
{
    public function create(array $data): ProductPhoto;
    public function delete(int $id): bool;
    public function listByProduct(int $productId): Collection;
}
