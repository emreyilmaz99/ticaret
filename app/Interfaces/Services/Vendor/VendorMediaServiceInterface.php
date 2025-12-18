<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;
use App\Models\VendorMedia;
use Illuminate\Http\UploadedFile;

interface VendorMediaServiceInterface
{
    public function upload(int $vendorId, UploadedFile $file, string $type = 'logo'): ServiceResponse;
    public function getActive(int $vendorId, string $type): ?VendorMedia;
    public function list(int $vendorId);
    public function delete(int $vendorId, int $mediaId): ServiceResponse;
    public function getUrl(?VendorMedia $media): ?string;
}
