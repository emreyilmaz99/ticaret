<?php

namespace App\Services\Media;

use App\Interfaces\Services\Media\ImageServiceInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService implements ImageServiceInterface
{
    protected ImageManager $imageManager;

    public function __construct()
    {
        // Initialize ImageManager with GD driver
        $this->imageManager = new ImageManager(new Driver());
    }
    /**
     * Upload and process review photos
     * Max 5 photos, resize to 1200px width, 85% quality
     * 
     * @param array $photos Array of UploadedFile
     * @return array Array of paths
     */
    public function uploadReviewPhotos(array $photos): array
    {
        $paths = [];
        $maxPhotos = 5;

        // Limit to 5 photos
        $photos = array_slice($photos, 0, $maxPhotos);

        foreach ($photos as $photo) {
            $path = $this->processAndUploadReviewPhoto($photo);
            $paths[] = $path;
        }

        return $paths;
    }

    /**
     * Process and upload single review photo
     * Resize max width 1200px, maintain aspect ratio, quality 85%
     * 
     * @param UploadedFile $photo
     * @return string Stored path
     */
    public function processAndUploadReviewPhoto(UploadedFile $photo): string
    {
        // Generate path: reviews/YYYY/MM/
        $year = date('Y');
        $month = date('m');
        $directory = "reviews/{$year}/{$month}";

        // Generate unique filename
        $filename = uniqid() . '_' . time() . '.jpg';
        $fullPath = $directory . '/' . $filename;

        // Process image with Intervention Image 3.x
        $image = $this->imageManager->read($photo->getRealPath());

        // Resize if width > 1200px, maintain aspect ratio
        if ($image->width() > 1200) {
            $image->scaleDown(width: 1200);
        }

        // Convert to JPEG with 85% quality
        $encoded = $image->toJpeg(quality: 85);

        // Store to public disk
        Storage::disk('public')->put($fullPath, (string) $encoded);

        return $fullPath;
    }

    /**
     * Delete review photo
     * 
     * @param string $path
     * @return bool
     */
    public function deleteReviewPhoto(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    /**
     * Delete multiple review photos
     * 
     * @param array $paths
     * @return void
     */
    public function deleteReviewPhotos(array $paths): void
    {
        foreach ($paths as $path) {
            $this->deleteReviewPhoto($path);
        }
    }
}
