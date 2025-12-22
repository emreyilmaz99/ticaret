<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\VendorEarning;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderObserver
{
    /**
     * Handle the Order "updated" event.
     * Automatically track status changes in history
     */
    public function updated(Order $order): void
    {
        // Check if status was changed
        if ($order->isDirty('status')) {
            $oldStatus = $order->getOriginal('status');
            $newStatus = $order->status;

            // Get metadata if provided via updateStatus method
            $metadata = $order->statusChangeMetadata ?? [];

            // Create status history record
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'note' => $metadata['note'] ?? null,
                'changed_by_type' => $metadata['changed_by_type'] ?? null,
                'changed_by_id' => $metadata['changed_by_id'] ?? null,
            ]);
        }

        // Track payment status changes
        if ($order->isDirty('payment_status')) {
            // Log payment status change if needed
            Log::info('Payment status changed', [
                'order_id' => $order->id,
                'old' => $order->getOriginal('payment_status'),
                'new' => $order->payment_status,
            ]);
        }

        // Create vendor earnings when order is delivered
        if ($order->isDirty('status') && $order->status === 'delivered') {
            $this->createVendorEarnings($order);
        }
    }

    /**
     * Create vendor earnings for all order items when order is delivered
     */
    protected function createVendorEarnings(Order $order): void
    {
        try {
            DB::transaction(function () use ($order) {
                foreach ($order->orderItems as $orderItem) {
                    // Skip if earning already exists for this order item
                    if (VendorEarning::where('order_item_id', $orderItem->id)->exists()) {
                        continue;
                    }

                    // Create earning record
                    $earning = VendorEarning::createFromOrderItem($orderItem);

                    Log::info('Vendor earning created', [
                        'earning_id' => $earning->id,
                        'vendor_id' => $earning->vendor_id,
                        'order_id' => $order->id,
                        'order_item_id' => $orderItem->id,
                        'net_earning' => $earning->net_earning,
                    ]);
                }
            });
        } catch (\Exception $e) {
            Log::error('Failed to create vendor earnings', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
