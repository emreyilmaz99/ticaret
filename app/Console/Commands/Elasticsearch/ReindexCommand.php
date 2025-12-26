<?php

namespace App\Console\Commands\Elasticsearch;

use App\Models\Product;
use App\Services\Elasticsearch\Index\ProductIndexManager;
use App\Services\Elasticsearch\ProductIndexService;
use Illuminate\Console\Command;

class ReindexCommand extends Command
{
    protected $signature = 'elasticsearch:reindex {--recreate : Recreate index before reindexing}';
    protected $description = 'Reindex all products to Elasticsearch';

    public function __construct(
        private ProductIndexManager $indexManager,
        private ProductIndexService $indexService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        if ($this->option('recreate')) {
            $this->warn('Recreating index...');
            $this->indexManager->deleteIndex();
            $this->indexManager->createIndex();
        }

        $this->info('Starting reindex...');

        $products = Product::with(['vendor', 'category', 'variants', 'photos'])
            ->where('status', 'active')
            ->get();

        if ($products->isEmpty()) {
            $this->warn('No active products found');
            return Command::SUCCESS;
        }

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        $successCount = 0;
        $failedCount = 0;

        foreach ($products as $product) {
            try {
                // Use ProductIndexService to sync (same logic as Observer)
                $this->indexService->syncToElasticsearch($product);
                $successCount++;
                $bar->advance();
            } catch (\Exception $e) {
                $failedCount++;
                $this->error("\nFailed to index product {$product->id}: {$e->getMessage()}");
            }
        }

        $bar->finish();
        $this->newLine();

        // Refresh index
        $this->indexManager->refresh();

        $this->info("Successfully indexed {$successCount} products!");
        
        if ($failedCount > 0) {
            $this->warn("Failed to index {$failedCount} products");
        }
        
        return Command::SUCCESS;
    }
}
