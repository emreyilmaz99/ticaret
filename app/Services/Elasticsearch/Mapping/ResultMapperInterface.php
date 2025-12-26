<?php

namespace App\Services\Elasticsearch\Mapping;

interface ResultMapperInterface
{
    /**
     * Map Elasticsearch results to array
     */
    public function map(array $results): array;

    /**
     * Map single hit to array
     */
    public function mapHit(array $hit): array;
}
