<?php

namespace App\Interfaces\Services\Product;

use App\Models\ProductPhoto;

interface ProductMediaServiceInterface
{
    public function uploadPhoto(int $productId, string $path, ?int $order = null, bool $isPrimary = false): ProductPhoto;
    public function deletePhoto(int $photoId): bool;
    public function getProductPhotos(int $productId);
}
