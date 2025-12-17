<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkReviewActionRequest;
use App\Http\Requests\Api\V1\Admin\RejectReviewRequest;
use App\Models\ProductReview;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminReviewController extends Controller
{
    use ResponseHttp;
    /**
     * GET /api/v1/admin/reviews
     * List all reviews with filters
     */
    public function index(Request $request)
    {
        $query = ProductReview::with(['user', 'product.vendor', 'media', 'response.vendor'])
            ->when($request->has('status'), function ($q) use ($request) {
                $q->where('status', $request->input('status'));
            })
            ->when($request->has('rating'), function ($q) use ($request) {
                $q->where('rating', $request->input('rating'));
            })
            ->when($request->has('search'), function ($q) use ($request) {
                $search = $request->input('search');
                $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('comment', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->boolean('with_trashed'), function ($q) {
                $q->withTrashed();
            })
            ->latest()
            ->paginate($request->integer('per_page', 50));

        return $this->success(
            $query,
            'Yorumlar başarıyla getirildi.'
        );
    }

    /**
     * POST /api/v1/admin/reviews/bulk-approve
     * Bulk approve reviews
     */
    public function bulkApprove(BulkReviewActionRequest $request)
    {
        $reviewIds = $request->input('review_ids');

        DB::transaction(function () use ($reviewIds) {
            ProductReview::whereIn('id', $reviewIds)
                ->where('status', '!=', 'approved')
                ->update([
                    'status' => 'approved',
                    'rejection_reason' => null,
                ]);
        });

        return $this->success(
            null,
            'Seçilen yorumlar onaylandı.'
        );
    }

    /**
     * POST /api/v1/admin/reviews/bulk-reject
     * Bulk reject reviews
     */
    public function bulkReject(BulkReviewActionRequest $request)
    {
        $reviewIds = $request->input('review_ids');
        $rejectionReason = $request->input('rejection_reason');

        DB::transaction(function () use ($reviewIds, $rejectionReason) {
            ProductReview::whereIn('id', $reviewIds)
                ->where('status', '!=', 'rejected')
                ->update([
                    'status' => 'rejected',
                    'rejection_reason' => $rejectionReason,
                ]);
        });

        return $this->success(
            null,
            'Seçilen yorumlar reddedildi.'
        );
    }

    /**
     * POST /api/v1/admin/reviews/{id}/approve
     * Approve single review
     */
    public function approve(string $id)
    {
        $review = ProductReview::findOrFail($id);

        if ($review->status === 'approved') {
            return $this->error('Yorum zaten onaylandı.', 400);
        }

        $review->update([
            'status' => 'approved',
            'rejection_reason' => null,
        ]);

        return $this->success(
            $review,
            'Yorum onaylandı.'
        );
    }

    /**
     * POST /api/v1/admin/reviews/{id}/reject
     * Reject single review
     */
    public function reject(RejectReviewRequest $request, string $id)
    {
        $review = ProductReview::findOrFail($id);

        if ($review->status === 'rejected') {
            return $this->error('Yorum zaten reddedilmiş.', 400);
        }

        $review->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('rejection_reason'),
        ]);

        return $this->success(
            $review,
            'Yorum reddedildi.'
        );
    }

    /**
     * GET /api/v1/admin/reviews/stats
     * Get review statistics
     */
    public function stats()
    {
        $stats = [
            'pending' => ProductReview::where('status', 'pending')->count(),
            'approved' => ProductReview::where('status', 'approved')->count(),
            'rejected' => ProductReview::where('status', 'rejected')->count(),
            'trashed' => ProductReview::onlyTrashed()->count(),
            'total' => ProductReview::withTrashed()->count(),
        ];

        return $this->success(
            $stats,
            'Yorum istatistikleri başarıyla getirildi.'
        );
    }

    /**
     * GET /api/v1/admin/reviews/trashed
     * List only soft deleted reviews
     */
    public function trashed(Request $request)
    {
        $reviews = ProductReview::onlyTrashed()
            ->with(['user', 'product', 'media'])
            ->latest('deleted_at')
            ->paginate($request->integer('per_page', 50));

        return $this->success(
            $reviews,
            'Silinmiş yorumlar başarıyla getirildi.'
        );
    }
}
