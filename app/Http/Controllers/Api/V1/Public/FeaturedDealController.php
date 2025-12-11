<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\FeaturedDeal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeaturedDealController extends Controller
{
    /**
     * Get current active featured deals
     */
    public function index(Request $request): JsonResponse
    {
        $deals = FeaturedDeal::with(['product.photos', 'product.vendor', 'variant'])
            ->current()
            ->ordered()
            ->get()
            ->map(function ($deal) {
                // Increment view count
                $deal->incrementViews();

                $product = $deal->product;
                $variant = $deal->variant;

                return [
                    'id' => $deal->id,
                    'product_id' => $deal->product_id,
                    'variant_id' => $deal->variant_id,
                    'title' => $deal->title,
                    'description' => $deal->description,
                    'deal_price' => (float) $deal->deal_price,
                    'original_price' => (float) $deal->original_price,
                    'discount_percentage' => (float) $deal->discount_percentage,
                    'background_color' => $deal->background_color,
                    'badge_text' => $deal->badge_text,
                    'badge_color' => $deal->badge_color,
                    'starts_at' => $deal->starts_at?->toIso8601String(),
                    'ends_at' => $deal->ends_at?->toIso8601String(),
                    'remaining_time' => $deal->remaining_time,
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'image' => $product->photos->first()?->file_path ?? '',
                        'images' => $product->photos->map(fn($p) => $p->file_path)->toArray(),
                        'vendor' => [
                            'id' => $product->vendor?->id,
                            'name' => $product->vendor?->company_name ?? '',
                        ],
                    ],
                    'variant' => $variant ? [
                        'id' => $variant->id,
                        'title' => $variant->title,
                        'sku' => $variant->sku,
                        'stock' => $variant->stock,
                    ] : null,
                    'view_count' => $deal->view_count,
                    'click_count' => $deal->click_count,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'deals' => $deals,
            ],
        ]);
    }

    /**
     * Track click on a deal
     */
    public function click(FeaturedDeal $deal): JsonResponse
    {
        $deal->incrementClicks();

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Track conversion (when added to cart or purchased)
     */
    public function conversion(FeaturedDeal $deal): JsonResponse
    {
        $deal->incrementConversions();

        return response()->json([
            'success' => true,
        ]);
    }
}
