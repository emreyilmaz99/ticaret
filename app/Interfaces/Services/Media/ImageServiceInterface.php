<?php

namespace App\Interfaces\Services\Media;

use Illuminate\Http\UploadedFile;

interface ImageServiceInterface
{
    public function uploadReviewPhotos(array $photos): array;
    public function processAndUploadReviewPhoto(UploadedFile $photo): string;
    public function deleteReviewPhoto(string $path): bool;
    public function deleteReviewPhotos(array $paths): void;
}
