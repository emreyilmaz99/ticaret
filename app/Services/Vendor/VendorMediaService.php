<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorMediaServiceInterface;
use App\Services\BaseService;
use App\Core\ServiceResponse;
use App\Models\VendorMedia;
use App\Repositories\Interfaces\VendorMediaRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class VendorMediaService extends BaseService implements VendorMediaServiceInterface
{
    protected VendorMediaRepositoryInterface $mediaRepo;

    public function __construct(VendorMediaRepositoryInterface $mediaRepo)
    {
        $this->mediaRepo = $mediaRepo;
    }

    /**
     * Media yükle (logo, cover, banner, document)
     */
    public function upload(int $vendorId, UploadedFile $file, string $type = 'logo'): ServiceResponse
    {
        try {
            // Aynı türdeki eski media'ları deaktif et
            $this->mediaRepo->deactivateAllByType($vendorId, $type);

            // Dosyayı kaydet
            $path = $file->store("vendors/{$vendorId}/{$type}", 'public');

            // Media kaydı oluştur
            $media = $this->mediaRepo->create([
                'vendor_id' => $vendorId,
                'type' => $type,
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'is_active' => true,
            ]);

            return $this->successResponse($media, 'Media uploaded successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to upload media');
        }
    }

    /**
     * Aktif media getir
     */
    public function getActive(int $vendorId, string $type): ?VendorMedia
    {
        return $this->mediaRepo->findActiveByVendorAndType($vendorId, $type);
    }

    /**
     * Tüm media'ları listele
     */
    public function list(int $vendorId)
    {
        return $this->mediaRepo->listByVendor($vendorId);
    }

    /**
     * Media sil
     */
    public function delete(int $vendorId, int $mediaId): ServiceResponse
    {
        try {
            $media = $this->mediaRepo->findByVendorAndId($vendorId, $mediaId);

            if (!$media) {
                return $this->errorResponse('Media not found', 404);
            }

            // Dosyayı storage'dan sil
            Storage::disk('public')->delete($media->file_path);

            // Kaydı sil
            $this->mediaRepo->delete($mediaId);

            return $this->successResponse(null, 'Media deleted successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to delete media');
        }
    }

    /**
     * Media URL'i oluştur
     */
    public function getUrl(?VendorMedia $media): ?string
    {
        if (!$media || !$media->file_path) {
            return null;
        }

        return url('storage/' . $media->file_path);
    }
}
