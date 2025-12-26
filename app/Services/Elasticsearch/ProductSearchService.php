<?php

namespace App\Services\Elasticsearch;

use App\Services\Elasticsearch\Client\ElasticsearchClientFactory;
use App\Services\Elasticsearch\Index\ProductIndexManager;
use App\Services\Elasticsearch\Mapping\ProductResultMapper;
use App\Services\Elasticsearch\Query\ProductQueryBuilder;
use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Elastic\Elasticsearch\Exception\ServerResponseException;
use Illuminate\Support\Facades\Log;

class ProductSearchService
{
    private Client $client;
    private ProductIndexManager $indexManager;
    private ProductResultMapper $resultMapper;
    private ProductQueryBuilder $queryBuilder;

    public function __construct()
    {
        $this->client = ElasticsearchClientFactory::create();
        $this->indexManager = new ProductIndexManager();
        $this->resultMapper = new ProductResultMapper();
        $this->queryBuilder = new ProductQueryBuilder();
    }

    /**
     * Search products with filters
     */
    public function search(array $filters = []): array
    {
        try {
            $this->buildQuery($filters);
            
            $params = [
                'index' => $this->indexManager->getIndexName(),
                'body' => $this->queryBuilder->build(),
            ];

            $response = $this->client->search($params);
            $results = $this->resultMapper->map($response->asArray());

            return [
                'success' => true,
                'data' => $results['data'],
                'pagination' => [
                    'total' => $results['total'],
                    'per_page' => $filters['per_page'] ?? 10,
                    'current_page' => $filters['page'] ?? 1,
                    'last_page' => ceil($results['total'] / ($filters['per_page'] ?? 10)),
                ],
                'took_ms' => $results['took'],
            ];
        } catch (ClientResponseException | ServerResponseException $e) {
            Log::error('Elasticsearch search failed', [
                'message' => $e->getMessage(),
                'filters' => $filters,
            ]);

            return [
                'success' => false,
                'data' => [],
                'pagination' => [
                    'total' => 0,
                    'per_page' => $filters['per_page'] ?? 10,
                    'current_page' => $filters['page'] ?? 1,
                    'last_page' => 0,
                ],
                'error' => 'Search failed',
            ];
        }
    }

    /**
     * Autocomplete search (quick results)
     */
    public function autocomplete(string $keyword, int $limit = 8): array
    {
        try {
            $this->queryBuilder
                ->reset()
                ->autocomplete($keyword) // Use faster prefix query
                ->whereStatus('active')
                ->sortByRelevance()
                ->paginate(1, $limit)
                ->source([ // Only get necessary fields for autocomplete
                    'id', 'name', 'slug', 'min_price', 'max_price', 
                    'main_image', 'vendor_name', 'category_name', 'in_stock'
                ]);

            $params = [
                'index' => $this->indexManager->getIndexName(),
                'body' => $this->queryBuilder->build(),
            ];

            $response = $this->client->search($params);
            $results = $this->resultMapper->map($response->asArray());

            return [
                'success' => true,
                'data' => array_map(function ($product) {
                    return [
                        'id' => $product['id'],
                        'name' => strip_tags($product['name']),
                        'slug' => $product['slug'],
                        'price' => $product['price'],
                        'image' => $product['main_image'],
                    ];
                }, $results['data']),
                'total' => $results['total'],
            ];
        } catch (ClientResponseException | ServerResponseException $e) {
            Log::error('Autocomplete search failed', [
                'message' => $e->getMessage(),
                'keyword' => $keyword,
            ]);

            return [
                'success' => false,
                'data' => [],
                'total' => 0,
            ];
        }
    }

    /**
     * Get index manager instance
     */
    public function getIndexManager(): ProductIndexManager
    {
        return $this->indexManager;
    }

    /**
     * Get query builder instance
     */
    public function getQueryBuilder(): ProductQueryBuilder
    {
        return $this->queryBuilder;
    }

    /**
     * Build query from filters
     */
    private function buildQuery(array $filters): void
    {
        $this->queryBuilder->reset();

        // Keyword search
        if (!empty($filters['q'])) {
            $this->queryBuilder->searchByKeyword($filters['q']);
            
            if (!empty($filters['highlight'])) {
                $this->queryBuilder->withHighlight();
            }
        }

        // Status filter (default: active)
        $status = $filters['status'] ?? 'active';
        $this->queryBuilder->whereStatus($status);

        // Category filter
        if (!empty($filters['category_id'])) {
            $this->queryBuilder->whereCategory((int)$filters['category_id']);
        }

        // Vendor filter
        if (!empty($filters['vendor_id'])) {
            $this->queryBuilder->whereVendor((int)$filters['vendor_id']);
        }

        // Price range filter
        if (!empty($filters['min_price']) || !empty($filters['max_price'])) {
            $min = $filters['min_price'] ?? 0;
            $max = $filters['max_price'] ?? PHP_FLOAT_MAX;
            $this->queryBuilder->wherePriceBetween((float)$min, (float)$max);
        }

        // Stock filter
        if (isset($filters['in_stock'])) {
            $this->queryBuilder->whereInStock((bool)$filters['in_stock']);
        }

        // Featured filter
        if (isset($filters['is_featured'])) {
            $this->queryBuilder->whereFeatured((bool)$filters['is_featured']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'relevance';
        $sortDirection = $filters['sort_direction'] ?? 'asc';

        switch ($sortBy) {
            case 'price':
                $this->queryBuilder->sortByPrice($sortDirection);
                break;
            case 'date':
            case 'newest':
                $this->queryBuilder->sortByDate('desc');
                break;
            case 'oldest':
                $this->queryBuilder->sortByDate('asc');
                break;
            case 'relevance':
            default:
                if (!empty($filters['q'])) {
                    $this->queryBuilder->sortByRelevance();
                } else {
                    $this->queryBuilder->sortByDate('desc');
                }
                break;
        }

        // Pagination
        $page = max(1, (int)($filters['page'] ?? 1));
        $perPage = min(100, max(1, (int)($filters['per_page'] ?? 10)));
        $this->queryBuilder->paginate($page, $perPage);
    }
}
