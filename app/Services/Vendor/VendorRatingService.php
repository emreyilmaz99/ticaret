<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorRatingServiceInterface;
use App\Services\BaseService;
use App\Core\ServiceResponse;
use App\Models\Vendor;
use App\Repositories\Interfaces\VendorRatingRepositoryInterface;

class VendorRatingService extends BaseService implements VendorRatingServiceInterface
{
    protected VendorRatingRepositoryInterface $ratingRepo;

    public function __construct(VendorRatingRepositoryInterface $ratingRepo)
    {
        $this->ratingRepo = $ratingRepo;
    }

    /**
     * Değerlendirme oluştur
     */
    public function create(int $vendorId, int $userId, array $data): ServiceResponse
    {
        try {
            // Kullanıcı bu vendor'ı bu sipariş için daha önce değerlendirmiş mi?
            $existing = $this->ratingRepo->findByVendorUserOrder(
                $vendorId,
                $userId,
                $data['order_id'] ?? null
            );

            if ($existing) {
                return $this->errorResponse('You have already rated this vendor', 422);
            }

            $rating = $this->ratingRepo->create([
                'vendor_id' => $vendorId,
                'user_id' => $userId,
                'order_id' => $data['order_id'] ?? null,
                'rating' => $data['rating'],
                'review' => $data['review'] ?? null,
                'is_approved' => false,
            ]);

            return $this->successResponse($rating, 'Rating submitted successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to create rating');
        }
    }

    /**
     * Değerlendirmeyi onayla (admin)
     */
    public function approve(int $ratingId): ServiceResponse
    {
        try {
            $approved = $this->ratingRepo->approve($ratingId);

            if (!$approved) {
                return $this->errorResponse('Failed to approve rating', 500);
            }

            // Vendor'ın ortalama puanını güncelle
            $rating = $this->ratingRepo->findById($ratingId);
            $this->updateVendorStats($rating->vendor_id);

            return $this->successResponse(null, 'Rating approved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to approve rating');
        }
    }

    /**
     * Onaylı değerlendirmeleri listele
     */
    public function listApproved(int $vendorId, int $perPage = 15)
    {
        return $this->ratingRepo->listApprovedByVendor($vendorId, $perPage);
    }

    /**
     * Tüm değerlendirmeleri listele (admin)
     */
    public function listAll(int $vendorId, int $perPage = 15)
    {
        return $this->ratingRepo->listByVendor($vendorId, $perPage);
    }

    /**
     * Değerlendirme istatistiklerini güncelle
     */
    protected function updateVendorStats(int $vendorId): void
    {
        $avgRating = $this->ratingRepo->getAverageRating($vendorId);
        $ratingCount = $this->ratingRepo->getRatingCount($vendorId);

        $vendor = Vendor::findOrFail($vendorId);
        $vendor->rating_avg = $avgRating;
        $vendor->rating_count = $ratingCount;
        $vendor->save();
    }

    /**
     * Değerlendirmeyi reddet (admin)
     */
    public function reject(int $ratingId): ServiceResponse
    {
        try {
            $deleted = $this->ratingRepo->delete($ratingId);

            if (!$deleted) {
                return $this->errorResponse('Rating not found', 404);
            }

            return $this->successResponse(null, 'Rating rejected successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to reject rating');
        }
    }

    /**
     * Vendor ortalama puanını getir
     */
    public function getAverageRating(int $vendorId): float
    {
        return $this->ratingRepo->getAverageRating($vendorId);
    }

    /**
     * Vendor toplam değerlendirme sayısını getir
     */
    public function getRatingCount(int $vendorId): int
    {
        return $this->ratingRepo->getRatingCount($vendorId);
    }
}
