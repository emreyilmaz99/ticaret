<?php

namespace App\Observers;

use App\Models\Product;
use App\Services\Elasticsearch\ProductIndexService;

/**
 * ProductElasticsearchObserver
 * 
 * Listens to Product model events and delegates Elasticsearch operations
 * to ProductIndexService. Keeps Observer thin and focused.
 */
class ProductElasticsearchObserver
{
    public function __construct(
        private ProductIndexService $indexService
    ) {}

    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        $this->indexService->syncToElasticsearch($product);
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        $this->indexService->syncToElasticsearch($product);
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        $this->indexService->removeFromElasticsearch($product);
    }
}
