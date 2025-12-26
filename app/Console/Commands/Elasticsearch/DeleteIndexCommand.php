<?php

namespace App\Console\Commands\Elasticsearch;

use App\Services\Elasticsearch\Index\ProductIndexManager;
use Illuminate\Console\Command;

class DeleteIndexCommand extends Command
{
    protected $signature = 'elasticsearch:delete-index {--force : Skip confirmation}';
    protected $description = 'Delete Elasticsearch product index';

    public function __construct(
        private ProductIndexManager $indexManager
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        if (!$this->option('force')) {
            if (!$this->confirm('Are you sure you want to delete the index?')) {
                $this->info('Operation cancelled');
                return Command::SUCCESS;
            }
        }

        $this->warn('Deleting Elasticsearch index...');
        
        if ($this->indexManager->deleteIndex()) {
            $this->info("Index '{$this->indexManager->getIndexName()}' deleted successfully!");
            return Command::SUCCESS;
        }

        $this->error('Failed to delete index');
        return Command::FAILURE;
    }
}
