<?php

namespace App\Services\Elasticsearch;

use App\Models\Product;
use App\Services\Elasticsearch\Index\ProductIndexManager;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * ProductIndexService
 * 
 * Handles business logic for indexing products to Elasticsearch.
 * Separates concerns from Observer and provides testable methods.
 */
class ProductIndexService
{
    public function __construct(
        private ProductIndexManager $indexManager
    ) {}

    /**
     * Sync product to Elasticsearch
     */
    public function syncToElasticsearch(Product $product): void
    {
        // Only index active products
        if ($product->status !== 'active') {
            $this->removeFromElasticsearch($product);
            return;
        }

        try {
            $document = $this->prepareDocument($product);
            $this->indexManager->indexDocument($document, $product->id);
            $this->clearSearchCache();
            
            Log::info("Product indexed to Elasticsearch", ['product_id' => $product->id]);
        } catch (\Exception $e) {
            Log::error("Failed to index product to Elasticsearch", [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove product from Elasticsearch
     */
    public function removeFromElasticsearch(Product $product): void
    {
        try {
            $this->indexManager->deleteDocument($product->id);
            $this->clearSearchCache();
            
            Log::info("Product removed from Elasticsearch", ['product_id' => $product->id]);
        } catch (\Exception $e) {
            Log::error("Failed to remove product from Elasticsearch", [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Prepare document for Elasticsearch indexing
     */
    private function prepareDocument(Product $product): array
    {
        // Load necessary relationships
        $product->load(['vendor', 'category', 'variants', 'photos']);

        // Get min/max prices from variants
        $prices = $product->variants->pluck('price')->filter();
        $discountPrices = $product->variants->pluck('discount_price')->filter();
        $minPrice = $prices->min() ?? 0;
        $maxPrice = $prices->max() ?? 0;
        $inStock = $product->variants->sum('stock') > 0;

        // Get rating and review count
        $approvedReviews = $product->approvedReviews();
        $rating = round($approvedReviews->avg('rating') ?? 0, 1);
        $reviewCount = $approvedReviews->count();

        // Get images
        $mainImage = $product->photos->first()?->url;
        $images = $product->photos->take(4)->pluck('url')->toArray();

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'short_description' => $product->short_description,
            'description' => $product->description,
            'status' => $product->status,
            'is_featured' => $product->is_featured,
            'type' => $product->type,
            'vendor_id' => $product->vendor_id,
            'vendor_name' => $product->vendor?->company_name,
            'vendor_slug' => $product->vendor?->slug,
            'category_id' => $product->category_id,
            'category_name' => $product->category?->name,
            'category_slug' => $product->category?->slug,
            'min_price' => $minPrice,
            'max_price' => $maxPrice,
            'discount_price' => $discountPrices->min(),
            'in_stock' => $inStock,
            'rating' => $rating,
            'review_count' => $reviewCount,
            'main_image' => $mainImage,
            'images' => $images,
            'created_at' => $product->created_at?->toIso8601String(),
            'updated_at' => $product->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Clear search cache
     */
    private function clearSearchCache(): void
    {
        try {
            // Clear all search-related cache keys
            Cache::tags(['search'])->flush();
        } catch (\Exception $e) {
            // If tags not supported (like file cache driver), silently continue
            // Redis and Memcached support tags, file driver doesn't
            Log::debug("Cache tags not supported, skipping tag flush", [
                'driver' => config('cache.default'),
                'error' => $e->getMessage()
            ]);
        }
    }
}
