<?php

namespace App\Services\Elasticsearch\Mapping;

use App\Models\Product;

class ProductResultMapper implements ResultMapperInterface
{
    /**
     * Map Elasticsearch results to array
     */
    public function map(array $results): array
    {
        $hits = $results['hits']['hits'] ?? [];
        $total = $results['hits']['total']['value'] ?? 0;

        // OPTIMIZATION: Collect all product IDs first
        $productIds = array_map(fn($hit) => $hit['_source']['id'] ?? null, $hits);
        $productIds = array_filter($productIds);

        // OPTIMIZATION: Load ALL products in ONE query with eager loading
        $products = Product::with(['vendor', 'category', 'photos', 'variants'])
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        // Map results using loaded products
        $mappedProducts = array_map(
            fn($hit) => $this->mapHit($hit, $products),
            $hits
        );

        return [
            'data' => $mappedProducts,
            'total' => $total,
            'took' => $results['took'] ?? 0,
        ];
    }

    /**
     * Map single hit to array
     */
    public function mapHit(array $hit, $products = null): array
    {
        $source = $hit['_source'] ?? [];
        $highlight = $hit['highlight'] ?? [];

        // OPTIMIZATION: Try ES source first (no DB query needed!)
        if (!empty($source['rating']) || !empty($source['main_image'])) {
            // ES has complete data, use it directly (ULTRA FAST)
            return $this->mapFromSource($source, $highlight, $hit['_score'] ?? null);
        }

        // Fallback: Load from DB if ES data incomplete (backwards compatibility)
        $product = $products 
            ? ($products->get($source['id']) ?? null)
            : Product::with(['vendor', 'category', 'photos', 'variants'])->find($source['id']);

        if (!$product) {
            return $this->mapFromSource($source, $highlight, $hit['_score'] ?? null);
        }

        return [
            'id' => $product->id,
            'name' => $this->getHighlighted($highlight, 'name', $product->name),
            'slug' => $product->slug,
            'description' => $this->getHighlighted($highlight, 'description', $product->description),
            'short_description' => $this->getHighlighted($highlight, 'short_description', $product->short_description),
            'sku' => $product->sku,
            'min_price' => $product->variants->min('price') ?? 0,
            'max_price' => $product->variants->max('price') ?? 0,
            'price' => $product->variants->first()?->price ?? 0,
            'discount_price' => $product->variants->first()?->discount_price,
            'main_image' => $product->photos->first()?->url,
            'images' => $product->photos->take(4)->pluck('url')->toArray(),
            'category' => [
                'id' => $product->category_id,
                'name' => $product->category?->name,
                'slug' => $product->category?->slug,
            ],
            'vendor' => [
                'id' => $product->vendor_id,
                'name' => $product->vendor?->company_name,
                'slug' => $product->vendor?->slug,
            ],
            'rating' => round($product->approvedReviews()->avg('rating') ?? 0, 1),
            'review_count' => $product->approvedReviews()->count(),
            'is_featured' => $product->is_featured,
            'in_stock' => $product->variants->sum('stock') > 0,
            'status' => $product->status,
            '_score' => $hit['_score'] ?? null,
        ];
    }

    /**
     * Map from Elasticsearch source (fallback)
     */
    private function mapFromSource(array $source, array $highlight, ?float $score = null): array
    {
        return [
            'id' => $source['id'] ?? null,
            'name' => $this->getHighlighted($highlight, 'name', $source['name'] ?? ''),
            'slug' => $source['slug'] ?? '',
            'description' => $this->getHighlighted($highlight, 'description', $source['description'] ?? ''),
            'short_description' => $this->getHighlighted($highlight, 'short_description', $source['short_description'] ?? ''),
            'sku' => $source['sku'] ?? '',
            'min_price' => $source['min_price'] ?? 0,
            'max_price' => $source['max_price'] ?? 0,
            'price' => $source['min_price'] ?? 0,
            'discount_price' => $source['discount_price'] ?? null,
            'main_image' => $source['main_image'] ?? null,
            'images' => $source['images'] ?? [],
            'category' => [
                'id' => $source['category_id'] ?? null,
                'name' => $source['category_name'] ?? null,
                'slug' => $source['category_slug'] ?? null,
            ],
            'vendor' => [
                'id' => $source['vendor_id'] ?? null,
                'name' => $source['vendor_name'] ?? null,
                'slug' => $source['vendor_slug'] ?? null,
            ],
            'rating' => $source['rating'] ?? 0,
            'review_count' => $source['review_count'] ?? 0,
            'is_featured' => $source['is_featured'] ?? false,
            'in_stock' => $source['in_stock'] ?? false,
            'status' => $source['status'] ?? 'inactive',
            '_score' => $score,
        ];
    }

    /**
     * Get highlighted text or fallback to original
     */
    private function getHighlighted(array $highlight, string $field, ?string $fallback): ?string
    {
        return $highlight[$field][0] ?? $fallback;
    }
}
