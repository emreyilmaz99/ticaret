<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Product\SearchServiceInterface;
use App\Services\BaseService;
use App\Services\Elasticsearch\ProductSearchService;
use Illuminate\Support\Facades\Cache;

class SearchService extends BaseService implements SearchServiceInterface
{
    private int $cacheTtl;

    public function __construct(
        private ProductSearchService $elasticsearchService
    ) {
        $this->cacheTtl = (int) env('SEARCH_CACHE_TTL', 600); // 10 dakika default
    }

    /**
     * Search products (for autocomplete)
     */
    public function searchProducts(string $query): ServiceResponse
    {
        try {
            if (empty($query) || strlen($query) < 2) {
                $data = [
                    'products' => [],
                    'popular_searches' => [
                        'iPhone',
                        'Samsung',
                        'Laptop',
                        'Kulaklık',
                        'Telefon Kılıfı'
                    ]
                ];
                
                return $this->successResponse($data, 'Popular searches');
            }

            // Cache key for autocomplete
            $cacheKey = $this->getCacheKey('autocomplete', ['q' => $query]);

            // Try to get cached data first
            $cached = Cache::get($cacheKey);
            
            if ($cached !== null) {
                // Return cached data directly
                $data = [
                    'products' => $cached['products'],
                    'total' => $cached['total'],
                    'cached' => true
                ];
                return $this->successResponse($data, 'Search results (cached)');
            }

            // Cache miss - do Elasticsearch search
            $result = $this->elasticsearchService->autocomplete($query, 8);

            if (!$result['success']) {
                return $this->errorResponse('Search failed');
            }

            // Cache the final result
            $cacheData = [
                'products' => $result['data'],
                'total' => $result['total']
            ];
            Cache::put($cacheKey, $cacheData, $this->cacheTtl);

            $data = [
                'products' => $result['data'],
                'total' => $result['total'],
                'cached' => false
            ];

            return $this->successResponse($data, 'Search results');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Search failed');
        }
    }

    /**
     * Advanced search with filters
     */
    public function advancedSearch(array $filters): ServiceResponse
    {
        try {
            // Cache key for advanced search
            $cacheKey = $this->getCacheKey('advanced', $filters);

            // Try to get cached data first
            $cached = Cache::get($cacheKey);
            
            if ($cached !== null) {
                // Return cached data directly
                $data = [
                    'products' => $cached['products'],
                    'pagination' => $cached['pagination'],
                    'took_ms' => $cached['took_ms'] ?? null,
                    'cached' => true
                ];
                return $this->successResponse($data, 'Search results (cached)');
            }

            // Cache miss - do Elasticsearch search
            $result = $this->elasticsearchService->search($filters);

            if (!$result['success']) {
                return $this->errorResponse('Search failed');
            }

            // Cache the final result
            $cacheData = [
                'products' => $result['data'],
                'pagination' => $result['pagination'],
                'took_ms' => $result['took_ms'] ?? null,
            ];
            Cache::put($cacheKey, $cacheData, $this->cacheTtl);

            $data = [
                'products' => $result['data'],
                'pagination' => $result['pagination'],
                'took_ms' => $result['took_ms'] ?? null,
                'cached' => false
            ];

            return $this->successResponse($data, 'Search results');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Search failed');
        }
    }

    /**
     * Generate cache key from filters
     */
    private function getCacheKey(string $type, array $filters): string
    {
        // Remove null/empty values
        $filters = array_filter($filters, fn($value) => $value !== null && $value !== '');
        
        // Sort for consistent keys
        ksort($filters);
        
        return 'search:' . $type . ':' . md5(json_encode($filters));
    }

    /**
     * Clear all search cache
     */
    public function clearSearchCache(): void
    {
        Cache::flush(); // Tüm cache'i temizle (production'da daha selective olmalı)
    }
}

