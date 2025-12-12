<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
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
    }
}
