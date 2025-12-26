<?php

namespace App\Services\Product;

use App\Interfaces\Services\Product\ProductMediaServiceInterface;
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
class ProductMediaService extends BaseService implements ProductMediaServiceInterface
{
    protected ProductPhotoRepositoryInterface $photoRepo;

    public function __construct(ProductPhotoRepositoryInterface $photoRepo)
    {
        $this->photoRepo = $photoRepo;
    }

    /**
     * Upload product photo
     */
    public function uploadPhoto(string $productId, string $path, ?int $order = null, bool $isPrimary = false): ProductPhoto
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
    public function getProductPhotos(string $productId)
    {
        return $this->photoRepo->listByProduct($productId);
    }
}
