<?php

namespace App\Console\Commands;

use App\Models\VendorEarning;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MakeEarningsAvailable extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'earnings:make-available 
                            {--dry-run : Show what would be updated without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark pending vendor earnings as available for withdrawal after settlement period';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');

        $this->info('Checking for earnings ready to be made available...');

        // Get earnings that are pending and past their available_at date
        $earnings = VendorEarning::pending()
            ->whereNotNull('available_at')
            ->where('available_at', '<=', now())
            ->with('vendor:id,name')
            ->get();

        if ($earnings->isEmpty()) {
            $this->info('No earnings found ready to be made available.');
            return self::SUCCESS;
        }

        $this->info(sprintf('Found %d earning(s) ready to be made available.', $earnings->count()));

        if ($isDryRun) {
            $this->warn('DRY RUN MODE - No changes will be made');
            $this->table(
                ['ID', 'Vendor', 'Net Earning', 'Available At'],
                $earnings->map(fn($e) => [
                    $e->id,
                    $e->vendor->name,
                    $e->formatted_net_earning,
                    $e->available_at->format('Y-m-d H:i'),
                ])
            );
            return self::SUCCESS;
        }

        $updatedCount = 0;
        $failedCount = 0;

        foreach ($earnings as $earning) {
            try {
                if ($earning->markAvailable()) {
                    $updatedCount++;
                    
                    Log::info('Earning made available', [
                        'earning_id' => $earning->id,
                        'vendor_id' => $earning->vendor_id,
                        'net_earning' => $earning->net_earning,
                    ]);
                }
            } catch (\Exception $e) {
                $failedCount++;
                
                Log::error('Failed to make earning available', [
                    'earning_id' => $earning->id,
                    'error' => $e->getMessage(),
                ]);
                
                $this->error(sprintf('Failed to update earning #%d: %s', $earning->id, $e->getMessage()));
            }
        }

        $this->info(sprintf('Successfully updated %d earning(s).', $updatedCount));
        
        if ($failedCount > 0) {
            $this->warn(sprintf('%d earning(s) failed to update.', $failedCount));
        }

        return self::SUCCESS;
    }
}
