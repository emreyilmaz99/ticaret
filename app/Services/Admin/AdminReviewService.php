<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Admin\AdminReviewServiceInterface;
use App\Models\ProductReview;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;

class AdminReviewService extends BaseService implements AdminReviewServiceInterface
{
    public function list(array $filters): ServiceResponse
    {
        try {
            $query = ProductReview::with(['user', 'product.vendor', 'media', 'response.vendor'])
                ->when(isset($filters['status']), fn($q) => $q->where('status', $filters['status']))
                ->when(isset($filters['rating']), fn($q) => $q->where('rating', $filters['rating']))
                ->when(isset($filters['search']), function ($q) use ($filters) {
                    $search = $filters['search'];
                    $q->where(function ($query) use ($search) {
                        $query->where('title', 'like', "%{$search}%")
                            ->orWhere('comment', 'like', "%{$search}%")
                            ->orWhereHas('user', fn($userQuery) => $userQuery->where('name', 'like', "%{$search}%"));
                    });
                })
                ->when($filters['with_trashed'] ?? false, fn($q) => $q->withTrashed())
                ->latest()
                ->paginate($filters['per_page'] ?? 50);

            return $this->successResponse($query, 'Yorumlar başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorumlar getirilemedi');
        }
    }

    public function bulkApprove(array $reviewIds): ServiceResponse
    {
        try {
            DB::transaction(function () use ($reviewIds) {
                ProductReview::whereIn('id', $reviewIds)
                    ->where('status', '!=', 'approved')
                    ->update(['status' => 'approved', 'rejection_reason' => null]);
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
                ProductReview::whereIn('id', $reviewIds)
                    ->where('status', '!=', 'rejected')
                    ->update(['status' => 'rejected', 'rejection_reason' => $reason]);
            });

            return $this->successResponse(null, 'Seçilen yorumlar reddedildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu reddetme başarısız');
        }
    }

    public function approve(string $id): ServiceResponse
    {
        try {
            $review = ProductReview::findOrFail($id);

            if ($review->status === 'approved') {
                return $this->errorResponse('Yorum zaten onaylandı.', 400);
            }

            $review->update(['status' => 'approved', 'rejection_reason' => null]);

            return $this->successResponse($review, 'Yorum onaylandı.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorum onaylanamadı');
        }
    }

    public function reject(string $id, string $reason): ServiceResponse
    {
        try {
            $review = ProductReview::findOrFail($id);

            if ($review->status === 'rejected') {
                return $this->errorResponse('Yorum zaten reddedilmiş.', 400);
            }

            $review->update(['status' => 'rejected', 'rejection_reason' => $reason]);

            return $this->successResponse($review, 'Yorum reddedildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Yorum reddedilemedi');
        }
    }

    public function getStats(): ServiceResponse
    {
        try {
            $stats = [
                'pending' => ProductReview::where('status', 'pending')->count(),
                'approved' => ProductReview::where('status', 'approved')->count(),
                'rejected' => ProductReview::where('status', 'rejected')->count(),
                'trashed' => ProductReview::onlyTrashed()->count(),
                'total' => ProductReview::withTrashed()->count(),
            ];

            return $this->successResponse($stats, 'Yorum istatistikleri başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler alınamadı');
        }
    }

    public function getTrashed(int $perPage): ServiceResponse
    {
        try {
            $reviews = ProductReview::onlyTrashed()
                ->with(['user', 'product', 'media'])
                ->latest('deleted_at')
                ->paginate($perPage);

            return $this->successResponse($reviews, 'Silinmiş yorumlar başarıyla getirildi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Silinmiş yorumlar getirilemedi');
        }
    }
}
