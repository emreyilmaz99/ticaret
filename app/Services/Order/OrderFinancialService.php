<?php

namespace App\Services\Order;

use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Repositories\VendorEarningRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * OrderFinancialService
 * 
 * Handles financial operations related to orders,
 * specifically vendor earning calculations and creation.
 */
class OrderFinancialService
{
    public function __construct(
        protected OrderRepository $orderRepository,
        protected VendorEarningRepository $vendorEarningRepository
    ) {}

    /**
     * Create vendor earnings for all order items when order is delivered
     */
    public function createVendorEarnings(Order $order): void
    {
        try {
            DB::transaction(function () use ($order) {
                // Load orderItems if not already loaded
                $order = $this->orderRepository->loadWithItemsForPayment($order);

                foreach ($order->orderItems as $orderItem) {
                    // Skip if earning already exists for this order item
                    if ($this->vendorEarningRepository->existsForOrderItem($orderItem->id)) {
                        Log::debug('Earning already exists for order item', [
                            'order_item_id' => $orderItem->id,
                        ]);
                        continue;
                    }

                    // Skip if orderItem has no vendor_id
                    if (!$orderItem->vendor_id) {
                        Log::warning('OrderItem has no vendor_id, skipping earning creation', [
                            'order_item_id' => $orderItem->id,
                            'order_id' => $order->id,
                        ]);
                        continue;
                    }

                    // Create earning record
                    $earning = $this->vendorEarningRepository->createFromOrderItem($orderItem);

                    Log::info('Vendor earning created', [
                        'earning_id' => $earning->id,
                        'vendor_id' => $earning->vendor_id,
                        'order_id' => $order->id,
                        'order_item_id' => $orderItem->id,
                        'gross_amount' => $earning->gross_amount,
                        'net_earning' => $earning->net_earning ?? null,
                    ]);
                }
            });
        } catch (\Exception $e) {
            Log::error('Failed to create vendor earnings', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // Don't throw - let order status update succeed even if earning creation fails
            // Earnings can be created manually or via command later
        }
    }
}
