<?php

namespace App\Traits;

use App\Models\Product;

trait FormatsProductData
{
    /**
     * Format product image URL from photo model
     */
    protected function formatImageUrl($photo): ?string
    {
        if (!$photo) {
            return null;
        }

        if ($photo->path) {
            return url('storage/' . $photo->path);
        }
        
        if ($photo->url) {
            return filter_var($photo->url, FILTER_VALIDATE_URL) 
                ? $photo->url 
                : url(ltrim($photo->url, '/'));
        }

        return null;
    }

    /**
     * Get price information for a product including featured deals
     */
    protected function getProductPriceInfo($product, $variant = null): array
    {
        // Check for active featured deal
        $featuredDeal = $product->activeFeaturedDeal ?? null;
        
        if ($featuredDeal) {
            return [
                'current_price' => (float) $featuredDeal->deal_price,
                'original_price' => (float) $featuredDeal->original_price,
                'discount_percentage' => $featuredDeal->discount_percentage,
                'has_deal' => true,
                'deal_badge' => [
                    'text' => $featuredDeal->badge_text,
                    'color' => $featuredDeal->badge_color,
                ],
            ];
        }

        // Use provided variant or get first variant
        $targetVariant = $variant ?? $product->variants->first();
        $currentPrice = $targetVariant ? (float) $targetVariant->price : 0;
        $comparePrice = $targetVariant?->compare_price ? (float) $targetVariant->compare_price : null;

        return [
            'current_price' => $currentPrice,
            'original_price' => $comparePrice,
            'discount_percentage' => $comparePrice && $currentPrice < $comparePrice 
                ? round((($comparePrice - $currentPrice) / $comparePrice) * 100, 2)
                : null,
            'has_deal' => false,
            'deal_badge' => null,
        ];
    }

    /**
     * Validate if product exists and is active
     */
    protected function validateActiveProduct(string $productId): ?Product
    {
        return Product::where('id', $productId)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Check if product is in stock
     */
    protected function isProductInStock($product): bool
    {
        $firstVariant = $product->variants->first();
        return $firstVariant && $firstVariant->stock > 0;
    }
}
