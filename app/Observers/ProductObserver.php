<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductObserver
{
    /**
     * Invalidate product-related caches
     */
    protected function invalidateCache(Product $product): void
    {
        $productId = $product->id;
        
        // Clear review-related caches
        Cache::forget("product:{$productId}:avg_rating");
        Cache::forget("product:{$productId}:review_count");
        Cache::forget("product:{$productId}:rating_breakdown");
        Cache::forget("product:{$productId}:review_summary");
        
        // Clear product detail cache if exists
        Cache::forget("product:{$productId}:detail");
        Cache::forget("product:slug:{$product->slug}:detail");
    }

    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        // Increment vendor's product count cache if exists
        if ($product->vendor_id) {
            Cache::forget("vendor:{$product->vendor_id}:product_count");
        }
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        // Clear cache when product details change
        if ($product->isDirty(['name', 'slug', 'description', 'status', 'price'])) {
            $this->invalidateCache($product);
        }

        // If status changed to/from active, update vendor stats
        if ($product->isDirty('status')) {
            if ($product->vendor_id) {
                Cache::forget("vendor:{$product->vendor_id}:product_count");
                Cache::forget("vendor:{$product->vendor_id}:active_product_count");
            }
        }
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        $this->invalidateCache($product);
        
        if ($product->vendor_id) {
            Cache::forget("vendor:{$product->vendor_id}:product_count");
            Cache::forget("vendor:{$product->vendor_id}:active_product_count");
        }
    }

    /**
     * Handle the Product "restored" event.
     */
    public function restored(Product $product): void
    {
        $this->invalidateCache($product);
        
        if ($product->vendor_id) {
            Cache::forget("vendor:{$product->vendor_id}:product_count");
        }
    }

    /**
     * Handle the Product "force deleted" event.
     */
    public function forceDeleted(Product $product): void
    {
        $this->invalidateCache($product);
        
        if ($product->vendor_id) {
            Cache::forget("vendor:{$product->vendor_id}:product_count");
        }
    }
}
