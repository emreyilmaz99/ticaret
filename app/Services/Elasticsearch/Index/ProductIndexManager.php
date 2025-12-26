<?php

namespace App\Services\Elasticsearch\Index;

use App\Services\Elasticsearch\Client\ElasticsearchClientFactory;
use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Elastic\Elasticsearch\Exception\ServerResponseException;
use Illuminate\Support\Facades\Log;

class ProductIndexManager implements IndexManagerInterface
{
    private Client $client;
    private string $indexName;

    public function __construct()
    {
        $this->client = ElasticsearchClientFactory::create();
        $this->indexName = config('services.elasticsearch.index_prefix', 'ticaret_') . 'products';
    }

    /**
     * Create index with mappings
     */
    public function createIndex(): bool
    {
        try {
            if ($this->indexExists()) {
                return true;
            }

            $params = [
                'index' => $this->indexName,
                'body' => [
                    'settings' => $this->getSettings(),
                    'mappings' => $this->getMappings(),
                ],
            ];

            $this->client->indices()->create($params);
            Log::info("Elasticsearch index created: {$this->indexName}");
            
            return true;
        } catch (ClientResponseException | ServerResponseException $e) {
            Log::error("Failed to create Elasticsearch index: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete index
     */
    public function deleteIndex(): bool
    {
        try {
            if (!$this->indexExists()) {
                return true;
            }

            $this->client->indices()->delete(['index' => $this->indexName]);
            Log::info("Elasticsearch index deleted: {$this->indexName}");
            
            return true;
        } catch (ClientResponseException | ServerResponseException $e) {
            Log::error("Failed to delete Elasticsearch index: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if index exists
     */
    public function indexExists(): bool
    {
        try {
            return $this->client->indices()->exists(['index' => $this->indexName])->asBool();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Index single document
     */
    public function indexDocument(array $document, string $id): bool
    {
        try {
            $params = [
                'index' => $this->indexName,
                'id' => $id,
                'body' => $document,
            ];

            $this->client->index($params);
            return true;
        } catch (ClientResponseException | ServerResponseException $e) {
            Log::error("Failed to index document: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Index multiple documents (bulk)
     */
    public function bulkIndex(array $documents): bool
    {
        try {
            $params = ['body' => []];

            foreach ($documents as $id => $document) {
                $params['body'][] = [
                    'index' => [
                        '_index' => $this->indexName,
                        '_id' => $id,
                    ]
                ];
                $params['body'][] = $document;
            }

            if (empty($params['body'])) {
                return true;
            }

            $response = $this->client->bulk($params);
            
            if ($response['errors'] ?? false) {
                Log::warning("Bulk indexing had errors", ['response' => $response]);
            }

            return true;
        } catch (ClientResponseException | ServerResponseException $e) {
            Log::error("Failed to bulk index documents: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update document
     */
    public function updateDocument(string $id, array $document): bool
    {
        try {
            $params = [
                'index' => $this->indexName,
                'id' => $id,
                'body' => [
                    'doc' => $document,
                    'doc_as_upsert' => true,
                ],
            ];

            $this->client->update($params);
            return true;
        } catch (ClientResponseException | ServerResponseException $e) {
            Log::error("Failed to update document: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete document
     */
    public function deleteDocument(string $id): bool
    {
        try {
            $params = [
                'index' => $this->indexName,
                'id' => $id,
            ];

            $this->client->delete($params);
            return true;
        } catch (ClientResponseException | ServerResponseException $e) {
            // Document might not exist, which is fine
            if ($e->getCode() === 404) {
                return true;
            }
            
            Log::error("Failed to delete document: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Refresh index
     */
    public function refresh(): bool
    {
        try {
            $this->client->indices()->refresh(['index' => $this->indexName]);
            return true;
        } catch (\Exception $e) {
            Log::error("Failed to refresh index: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get index settings
     */
    private function getSettings(): array
    {
        return [
            'number_of_shards' => 1,
            'number_of_replicas' => 0,
            'analysis' => [
                'analyzer' => [
                    'turkish_analyzer' => [
                        'type' => 'standard',
                        'stopwords' => '_turkish_',
                    ],
                ],
            ],
        ];
    }

    /**
     * Get index mappings
     */
    private function getMappings(): array
    {
        return [
            'properties' => [
                'id' => ['type' => 'keyword'],
                'name' => [
                    'type' => 'text',
                    'analyzer' => 'turkish_analyzer',
                    'fields' => [
                        'keyword' => ['type' => 'keyword'],
                    ],
                ],
                'slug' => ['type' => 'keyword'],
                'sku' => ['type' => 'keyword'],
                'description' => [
                    'type' => 'text',
                    'analyzer' => 'turkish_analyzer',
                ],
                'short_description' => [
                    'type' => 'text',
                    'analyzer' => 'turkish_analyzer',
                ],
                'status' => ['type' => 'keyword'],
                'is_featured' => ['type' => 'boolean'],
                'type' => ['type' => 'keyword'],
                'vendor_id' => ['type' => 'integer'],
                'vendor_name' => [
                    'type' => 'text',
                    'fields' => [
                        'keyword' => ['type' => 'keyword'],
                    ],
                ],
                'vendor_slug' => ['type' => 'keyword'],
                'category_id' => ['type' => 'integer'],
                'category_name' => [
                    'type' => 'text',
                    'fields' => [
                        'keyword' => ['type' => 'keyword'],
                    ],
                ],
                'category_slug' => ['type' => 'keyword'],
                'min_price' => ['type' => 'float'],
                'max_price' => ['type' => 'float'],
                'discount_price' => ['type' => 'float'],
                'in_stock' => ['type' => 'boolean'],
                'rating' => ['type' => 'float'],
                'review_count' => ['type' => 'integer'],
                'main_image' => ['type' => 'keyword'],
                'images' => ['type' => 'keyword'],
                'created_at' => ['type' => 'date'],
                'updated_at' => ['type' => 'date'],
            ],
        ];
    }

    /**
     * Get index name
     */
    public function getIndexName(): string
    {
        return $this->indexName;
    }
}
