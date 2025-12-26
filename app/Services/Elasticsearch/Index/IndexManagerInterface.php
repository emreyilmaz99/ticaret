<?php

namespace App\Services\Elasticsearch\Index;

interface IndexManagerInterface
{
    /**
     * Create index with mappings
     */
    public function createIndex(): bool;

    /**
     * Delete index
     */
    public function deleteIndex(): bool;

    /**
     * Check if index exists
     */
    public function indexExists(): bool;

    /**
     * Index single document
     */
    public function indexDocument(array $document, string $id): bool;

    /**
     * Index multiple documents (bulk)
     */
    public function bulkIndex(array $documents): bool;

    /**
     * Update document
     */
    public function updateDocument(string $id, array $document): bool;

    /**
     * Delete document
     */
    public function deleteDocument(string $id): bool;

    /**
     * Refresh index
     */
    public function refresh(): bool;
}
