<?php

namespace App\Services\Product;

use App\Services\BaseService;
use App\Models\ProductPhoto;
use App\Repositories\Interfaces\ProductPhotoRepositoryInterface;

/**
 * ProductMediaService
 * 
 * Handles product photo management.
 * Note: Some features like setPrimary and updateOrder are simplified
 * due to repository interface limitations.
 */
class ProductMediaService extends BaseService
{
    protected ProductPhotoRepositoryInterface $photoRepo;

    public function __construct(ProductPhotoRepositoryInterface $photoRepo)
    {
        $this->photoRepo = $photoRepo;
    }

    /**
     * Upload product photo
     */
    public function uploadPhoto(int $productId, string $path, ?int $order = null, bool $isPrimary = false): ProductPhoto
    {
        $photos = $this->photoRepo->listByProduct($productId);
        
        $data = [
            'product_id' => $productId,
            'photo_url' => $path,
            'is_primary' => $isPrimary || $photos->isEmpty(),
            'order' => $order ?? ($photos->max('order') ?? 0) + 1,
        ];

        return $this->photoRepo->create($data);
    }

    /**
     * Delete product photo
     */
    public function deletePhoto(int $photoId): bool
    {
        return $this->photoRepo->delete($photoId);
    }

    /**
     * Get all photos for a product
     */
    public function getProductPhotos(int $productId)
    {
        return $this->photoRepo->listByProduct($productId);
    }
}
