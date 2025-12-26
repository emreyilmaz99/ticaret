<?php

namespace App\Services\Elasticsearch\Query;

abstract class BaseQueryBuilder
{
    protected array $query = [];
    protected array $filters = [];
    protected array $sort = [];
    protected int $from = 0;
    protected int $size = 10;
    protected array $highlight = [];
    protected array $source = []; // Source filtering for performance
    protected bool $trackScores = true;

    /**
     * Add must match query
     */
    public function must(array $condition): static
    {
        $this->query['bool']['must'][] = $condition;
        return $this;
    }

    /**
     * Add should match query (OR)
     */
    public function should(array $condition): static
    {
        $this->query['bool']['should'][] = $condition;
        return $this;
    }

    /**
     * Add filter (does not affect score)
     */
    public function filter(array $condition): static
    {
        $this->filters[] = $condition;
        return $this;
    }

    /**
     * Set pagination
     */
    public function paginate(int $page, int $perPage): static
    {
        $this->from = ($page - 1) * $perPage;
        $this->size = $perPage;
        return $this;
    }

    /**
     * Add sorting
     */
    public function orderBy(string $field, string $direction = 'asc'): static
    {
        $this->sort[] = [$field => ['order' => $direction]];
        return $this;
    }

    /**
     * Add highlight
     */
    public function addHighlight(array $fields): static
    {
        foreach ($fields as $field) {
            $this->highlight['fields'][$field] = new \stdClass();
        }
        return $this;
    }

    /**
     * Set source fields (only return specific fields)
     */
    public function source(array $fields): static
    {
        $this->source = $fields;
        return $this;
    }

    /**
     * Disable score tracking for performance
     */
    public function disableScoreTracking(): static
    {
        $this->trackScores = false;
        return $this;
    }

    /**
     * Build final query array
     */
    public function build(): array
    {
        $body = [];

        // Add query
        if (!empty($this->query)) {
            if (!empty($this->filters)) {
                $this->query['bool']['filter'] = $this->filters;
            }
            $body['query'] = $this->query;
        } elseif (!empty($this->filters)) {
            $body['query']['bool']['filter'] = $this->filters;
        }

        // Add sort
        if (!empty($this->sort)) {
            $body['sort'] = $this->sort;
        }

        // Add pagination
        $body['from'] = $this->from;
        $body['size'] = $this->size;

        // Add highlight
        if (!empty($this->highlight)) {
            $body['highlight'] = $this->highlight;
        }

        // Add source filtering
        if (!empty($this->source)) {
            $body['_source'] = $this->source;
        }

        // Add score tracking
        if (!$this->trackScores && !empty($this->filters) && empty($this->query)) {
            $body['track_scores'] = false;
        }

        return $body;
    }

    /**
     * Reset query builder
     */
    public function reset(): static
    {
        $this->query = [];
        $this->filters = [];
        $this->sort = [];
        $this->from = 0;
        $this->size = 10;
        $this->highlight = [];
        $this->source = [];
        $this->trackScores = true;
        return $this;
    }
}
