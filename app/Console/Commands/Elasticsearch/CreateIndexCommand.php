<?php

namespace App\Console\Commands\Elasticsearch;

use App\Services\Elasticsearch\Index\ProductIndexManager;
use Illuminate\Console\Command;

class CreateIndexCommand extends Command
{
    protected $signature = 'elasticsearch:create-index {--force : Force recreate index}';
    protected $description = 'Create Elasticsearch product index';

    public function __construct(
        private ProductIndexManager $indexManager
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        if ($this->option('force')) {
            $this->warn('Deleting existing index...');
            $this->indexManager->deleteIndex();
        }

        $this->info('Creating Elasticsearch index...');
        
        if ($this->indexManager->createIndex()) {
            $this->info("Index '{$this->indexManager->getIndexName()}' created successfully!");
            return Command::SUCCESS;
        }

        $this->error('Failed to create index');
        return Command::FAILURE;
    }
}
