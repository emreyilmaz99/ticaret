<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\BulkReviewActionRequest;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminReviewController extends Controller
{
    /**
     * GET /api/v1/admin/reviews
     * List all reviews with filters
     */
    public function index(Request $request)
    {
        $query = ProductReview::with(['user', 'product', 'media', 'response.vendor'])
            ->when($request->has('status'), function ($q) use ($request) {
                $q->where('status', $request->input('status'));
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

        return response()->json([
            'success' => true,
            'data' => $query,
        ]);
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

        return response()->json([
            'success' => true,
            'message' => 'Seçilen yorumlar onaylandı.',
        ]);
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

        return response()->json([
            'success' => true,
            'message' => 'Seçilen yorumlar reddedildi.',
        ]);
    }

    /**
     * POST /api/v1/admin/reviews/{id}/approve
     * Approve single review
     */
    public function approve(string $id)
    {
        $review = ProductReview::findOrFail($id);

        if ($review->status === 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Yorum zaten onaylanmış.',
            ], 400);
        }

        $review->update([
            'status' => 'approved',
            'rejection_reason' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Yorum onaylandı.',
            'data' => $review,
        ]);
    }

    /**
     * POST /api/v1/admin/reviews/{id}/reject
     * Reject single review
     */
    public function reject(Request $request, string $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ], [
            'rejection_reason.required' => 'Ret nedeni belirtilmelidir.',
            'rejection_reason.max' => 'Ret nedeni en fazla 500 karakter olabilir.',
        ]);

        $review = ProductReview::findOrFail($id);

        if ($review->status === 'rejected') {
            return response()->json([
                'success' => false,
                'message' => 'Yorum zaten reddedilmiş.',
            ], 400);
        }

        $review->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('rejection_reason'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Yorum reddedildi.',
            'data' => $review,
        ]);
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

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
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

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }
}
