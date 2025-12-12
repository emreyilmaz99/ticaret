<?php

namespace App\Services\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ImageService
{
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

        // Process image with Intervention Image
        $image = Image::make($photo->getRealPath());

        // Resize if width > 1200px, maintain aspect ratio
        if ($image->width() > 1200) {
            $image->resize(1200, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }

        // Convert to JPEG with 85% quality
        $image->encode('jpg', 85);

        // Store to public disk
        Storage::disk('public')->put($fullPath, $image->stream());

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
