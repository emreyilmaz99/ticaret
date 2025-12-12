<?php

namespace App\Observers;

use App\Models\ProductReview;
use Illuminate\Support\Facades\Cache;

class ProductReviewObserver
{
    /**
     * Invalidate product review cache
     */
    protected function invalidateCache(ProductReview $productReview): void
    {
        $productId = $productReview->product_id;
        
        Cache::forget("product:{$productId}:avg_rating");
        Cache::forget("product:{$productId}:review_count");
        Cache::forget("product:{$productId}:rating_breakdown");
        Cache::forget("product:{$productId}:review_summary");
    }

    /**
     * Handle the ProductReview "created" event.
     * Only invalidate if status is 'approved'
     */
    public function created(ProductReview $productReview): void
    {
        if ($productReview->status === 'approved') {
            $this->invalidateCache($productReview);
        }
    }

    /**
     * Handle the ProductReview "updated" event.
     * Invalidate when status changes or rating changes
     */
    public function updated(ProductReview $productReview): void
    {
        // Check if status changed to/from approved or rating changed
        if ($productReview->isDirty('status') || $productReview->isDirty('rating')) {
            $this->invalidateCache($productReview);
        }
    }

    /**
     * Handle the ProductReview "deleted" event (soft delete).
     */
    public function deleted(ProductReview $productReview): void
    {
        // Only invalidate if the deleted review was approved
        if ($productReview->status === 'approved') {
            $this->invalidateCache($productReview);
        }
    }

    /**
     * Handle the ProductReview "restored" event.
     */
    public function restored(ProductReview $productReview): void
    {
        // Only invalidate if the restored review is approved
        if ($productReview->status === 'approved') {
            $this->invalidateCache($productReview);
        }
    }

    /**
     * Handle the ProductReview "force deleted" event.
     */
    public function forceDeleted(ProductReview $productReview): void
    {
        if ($productReview->status === 'approved') {
            $this->invalidateCache($productReview);
        }
    }
}
