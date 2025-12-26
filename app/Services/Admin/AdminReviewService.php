<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Admin\AdminReviewServiceInterface;
use App\Repositories\ProductReviewRepository;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;

class AdminReviewService extends BaseService implements AdminReviewServiceInterface
{
    public function __construct(
        protected ProductReviewRepository $reviewRepository
    ) {}

    public function list(array $filters): ServiceResponse
    {
        try {
            $reviews = $this->reviewRepository->getFiltered($filters);
            return $this->successResponse($reviews, 'Yorumlar başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorumlar getirilemedi');
        }
    }

    public function bulkApprove(array $reviewIds): ServiceResponse
    {
        try {
            DB::transaction(function () use ($reviewIds) {
                $this->reviewRepository->bulkApprove($reviewIds);
            });

            return $this->successResponse(null, 'Seçilen yorumlar onaylandı.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu onaylama başarısız');
        }
    }

    public function bulkReject(array $reviewIds, ?string $reason): ServiceResponse
    {
        try {
            DB::transaction(function () use ($reviewIds, $reason) {
                $this->reviewRepository->bulkReject($reviewIds, $reason);
            });

            return $this->successResponse(null, 'Seçilen yorumlar reddedildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu reddetme başarısız');
        }
    }

    public function approve(string $id): ServiceResponse
    {
        try {
            $review = $this->reviewRepository->find($id);

            if (!$review) {
                return $this->errorResponse('Yorum bulunamadı.', 404);
            }

            if ($review->status === 'approved') {
                return $this->errorResponse('Yorum zaten onaylandı.', 400);
            }

            $review = $this->reviewRepository->approve($id);
            return $this->successResponse($review, 'Yorum onaylandı.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorum onaylanamadı');
        }
    }

    public function reject(string $id, string $reason): ServiceResponse
    {
        try {
            $review = $this->reviewRepository->find($id);

            if (!$review) {
                return $this->errorResponse('Yorum bulunamadı.', 404);
            }

            if ($review->status === 'rejected') {
                return $this->errorResponse('Yorum zaten reddedilmiş.', 400);
            }

            $review = $this->reviewRepository->reject($id, $reason);
            return $this->successResponse($review, 'Yorum reddedildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorum reddedilemedi');
        }
    }

    public function getStats(): ServiceResponse
    {
        try {
            $stats = $this->reviewRepository->getStatistics();
            return $this->successResponse($stats, 'Yorum istatistikleri başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler alınamadı');
        }
    }

    public function getTrashed(int $perPage): ServiceResponse
    {
        try {
            // Note: Add this method to ProductReviewRepository if needed
            $reviews = $this->reviewRepository->getFiltered([
                'with_trashed' => true,
                'per_page' => $perPage
            ]);

            return $this->successResponse($reviews, 'Silinmiş yorumlar başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Silinmiş yorumlar getirilemedi');
        }
    }
}
