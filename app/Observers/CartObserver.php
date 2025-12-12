<?php

namespace App\Observers;

use App\Models\Cart;
use Illuminate\Support\Facades\Cache;

class CartObserver
{
    /**
     * Invalidate cart-related caches
     */
    protected function invalidateCache(Cart $cart): void
    {
        // Clear cart cache by user_id or session_id
        if ($cart->user_id) {
            Cache::forget("cart:user:{$cart->user_id}");
        }
        
        if ($cart->session_id) {
            Cache::forget("cart:session:{$cart->session_id}");
        }
        
        // Clear cart summary cache
        Cache::forget("cart:{$cart->id}:summary");
    }

    /**
     * Handle the Cart "updated" event.
     */
    public function updated(Cart $cart): void
    {
        // Clear cache when cart is updated
        if ($cart->isDirty(['coupon_code', 'coupon_id', 'total', 'subtotal'])) {
            $this->invalidateCache($cart);
        }
    }

    /**
     * Handle the Cart "deleted" event.
     */
    public function deleted(Cart $cart): void
    {
        $this->invalidateCache($cart);
    }
}
