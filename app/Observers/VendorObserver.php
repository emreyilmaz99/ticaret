<?php

namespace App\Observers;

use App\Models\Vendor;
use Illuminate\Support\Facades\Cache;

class VendorObserver
{
    /**
     * Invalidate vendor-related caches
     */
    protected function invalidateCache(Vendor $vendor): void
    {
        $vendorId = $vendor->id;
        
        // Clear vendor profile caches
        Cache::forget("vendor:{$vendorId}:profile");
        Cache::forget("vendor:slug:{$vendor->slug}:profile");
        
        // Clear vendor stats caches
        Cache::forget("vendor:{$vendorId}:product_count");
        Cache::forget("vendor:{$vendorId}:active_product_count");
        Cache::forget("vendor:{$vendorId}:rating_avg");
        Cache::forget("vendor:{$vendorId}:rating_count");
    }

    /**
     * Handle the Vendor "updated" event.
     */
    public function updated(Vendor $vendor): void
    {
        // Clear cache when vendor details change
        if ($vendor->isDirty(['name', 'slug', 'company_name', 'status', 'rating_avg', 'rating_count'])) {
            $this->invalidateCache($vendor);
        }
    }

    /**
     * Handle the Vendor "deleted" event.
     */
    public function deleted(Vendor $vendor): void
    {
        $this->invalidateCache($vendor);
    }

    /**
     * Handle the Vendor "restored" event.
     */
    public function restored(Vendor $vendor): void
    {
        $this->invalidateCache($vendor);
    }

    /**
     * Handle the Vendor "force deleted" event.
     */
    public function forceDeleted(Vendor $vendor): void
    {
        $this->invalidateCache($vendor);
    }
}
