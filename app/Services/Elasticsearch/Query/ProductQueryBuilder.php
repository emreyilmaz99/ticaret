<?php

namespace App\Services\Elasticsearch\Query;

class ProductQueryBuilder extends BaseQueryBuilder
{
    /**
     * Search by keyword (name, description, sku)
     */
    public function searchByKeyword(string $keyword): static
    {
        if (empty($keyword)) {
            return $this;
        }

        $this->should([
            'multi_match' => [
                'query' => $keyword,
                'fields' => ['name^3', 'description^2', 'short_description^2', 'sku'],
                'type' => 'best_fields',
                'fuzziness' => 'AUTO'
            ]
        ]);

        // Add minimum should match
        if (!isset($this->query['bool']['minimum_should_match'])) {
            $this->query['bool']['minimum_should_match'] = 1;
        }

        return $this;
    }

    /**
     * Fast autocomplete search (prefix match - ULTRA FAST)
     */
    public function autocomplete(string $keyword): static
    {
        if (empty($keyword)) {
            return $this;
        }

        // Prefix query is much faster than fuzzy for autocomplete
        $this->should([
            'match_phrase_prefix' => [
                'name' => [
                    'query' => $keyword,
                    'boost' => 3
                ]
            ]
        ]);

        $this->should([
            'match' => [
                'name' => [
                    'query' => $keyword,
                    'boost' => 2
                ]
            ]
        ]);

        if (!isset($this->query['bool']['minimum_should_match'])) {
            $this->query['bool']['minimum_should_match'] = 1;
        }

        return $this;
    }

    /**
     * Filter by status
     */
    public function whereStatus(string $status): static
    {
        $this->filter([
            'term' => [
                'status' => $status
            ]
        ]);
        return $this;
    }

    /**
     * Filter by category
     */
    public function whereCategory(int $categoryId): static
    {
        $this->filter([
            'term' => [
                'category_id' => $categoryId
            ]
        ]);
        return $this;
    }

    /**
     * Filter by vendor
     */
    public function whereVendor(int $vendorId): static
    {
        $this->filter([
            'term' => [
                'vendor_id' => $vendorId
            ]
        ]);
        return $this;
    }

    /**
     * Filter by price range
     */
    public function wherePriceBetween(float $min, float $max): static
    {
        $this->filter([
            'range' => [
                'min_price' => [
                    'gte' => $min,
                    'lte' => $max
                ]
            ]
        ]);
        return $this;
    }

    /**
     * Filter by stock availability
     */
    public function whereInStock(bool $inStock = true): static
    {
        $this->filter([
            'term' => [
                'in_stock' => $inStock
            ]
        ]);
        return $this;
    }

    /**
     * Filter featured products
     */
    public function whereFeatured(bool $featured = true): static
    {
        $this->filter([
            'term' => [
                'is_featured' => $featured
            ]
        ]);
        return $this;
    }

    /**
     * Sort by relevance (default)
     */
    public function sortByRelevance(): static
    {
        $this->orderBy('_score', 'desc');
        return $this;
    }

    /**
     * Sort by price
     */
    public function sortByPrice(string $direction = 'asc'): static
    {
        $this->orderBy('min_price', $direction);
        return $this;
    }

    /**
     * Sort by date
     */
    public function sortByDate(string $direction = 'desc'): static
    {
        $this->orderBy('created_at', $direction);
        return $this;
    }

    /**
     * Enable highlighting for search results
     */
    public function withHighlight(): static
    {
        $this->addHighlight(['name', 'description', 'short_description']);
        return $this;
    }
}
