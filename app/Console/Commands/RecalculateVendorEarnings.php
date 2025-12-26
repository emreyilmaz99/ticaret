<?php

namespace App\Console\Commands;

use App\Models\VendorEarning;
use Illuminate\Console\Command;

class RecalculateVendorEarnings extends Command
{
    protected $signature = 'earnings:recalculate {--dry-run : Preview changes without updating}';
    protected $description = 'Recalculate vendor earnings based on current order_item data';

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');

        $this->info('Starting vendor earnings recalculation...');

        if ($isDryRun) {
            $this->warn('DRY RUN MODE - No changes will be saved');
        }

        $earnings = VendorEarning::with('orderItem.order')->get();

        if ($earnings->isEmpty()) {
            $this->info('No earnings found to recalculate.');
            return self::SUCCESS;
        }

        $this->info("Found {$earnings->count()} earnings to recalculate.");

        $updated = 0;
        $errors = 0;

        $progressBar = $this->output->createProgressBar($earnings->count());
        $progressBar->start();

        foreach ($earnings as $earning) {
            try {
                $orderItem = $earning->orderItem;
                $order = $orderItem->order;

                if (!$orderItem || !$order) {
                    $errors++;
                    $this->newLine();
                    $this->error("Earning #{$earning->id}: Missing order_item or order data");
                    continue;
                }

                // Get tax rate and line total
                $taxRate = $orderItem->tax_rate ?? 0;
                $lineTotal = $orderItem->line_total;

                // Apply proportional coupon discount if exists
                $couponDiscount = 0;
                if ($order->coupon_discount > 0) {
                    $orderSubtotal = $order->orderItems()->sum('line_total');
                    if ($orderSubtotal > 0) {
                        $couponDiscount = ($lineTotal / $orderSubtotal) * $order->coupon_discount;
                    }
                }

                $priceAfterCoupon = $lineTotal - $couponDiscount;
                
                // Calculate price without tax (KDV hariç)
                $grossAmount = $priceAfterCoupon / (1 + ($taxRate / 100));

                // Recalculate commission and withholding tax based on new gross_amount
                $commissionAmount = $grossAmount * ($earning->commission_rate / 100);
                $withholdingTaxAmount = $grossAmount * ($earning->withholding_tax_rate / 100);
                $netEarning = $grossAmount - $commissionAmount - $withholdingTaxAmount;

                if ($isDryRun) {
                    if ($earning->gross_amount != round($grossAmount, 2)) {
                        $this->newLine();
                        $this->line("Earning #{$earning->id}:");
                        $this->line("  Current gross_amount: {$earning->gross_amount}");
                        $this->line("  New gross_amount: " . round($grossAmount, 2));
                        $this->line("  line_total: {$lineTotal}, tax_rate: {$taxRate}%");
                    }
                } else {
                    // Update the earning
                    $earning->update([
                        'gross_amount' => round($grossAmount, 2),
                        'commission_amount' => round($commissionAmount, 2),
                        'withholding_tax_amount' => round($withholdingTaxAmount, 2),
                        'net_earning' => round($netEarning, 2),
                    ]);
                    $updated++;
                }

                $progressBar->advance();
            } catch (\Exception $e) {
                $errors++;
                $this->newLine();
                $this->error("Earning #{$earning->id}: {$e->getMessage()}");
            }
        }

        $progressBar->finish();
        $this->newLine();

        if ($isDryRun) {
            $this->info('Dry run completed. No changes were saved.');
        } else {
            $this->info("Successfully recalculated {$updated} earnings.");
        }

        if ($errors > 0) {
            $this->warn("{$errors} earnings had errors.");
        }

        return self::SUCCESS;
    }
}
