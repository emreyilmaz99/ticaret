<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Services\Order\OrderFinancialService;
use Illuminate\Support\Facades\Log;

/**
 * OrderObserver
 * 
 * Listens to Order model events and delegates operations.
 * Tracks status changes and delegates financial operations to service.
 */
class OrderObserver
{
    public function __construct(
        private OrderFinancialService $financialService
    ) {}

    /**
     * Handle the Order "updated" event.
     * Automatically track status changes in history
     */
    public function updated(Order $order): void
    {
        // Track status changes
        if ($order->isDirty('status')) {
            $this->recordStatusChange($order);
            
            // Create vendor earnings when order is delivered
            if ($order->status === 'delivered') {
                $this->financialService->createVendorEarnings($order);
            }
        }

        // Track payment status changes
        if ($order->isDirty('payment_status')) {
            Log::info('Payment status changed', [
                'order_id' => $order->id,
                'old' => $order->getOriginal('payment_status'),
                'new' => $order->payment_status,
            ]);
        }
    }

    /**
     * Record status change in history
     */
    private function recordStatusChange(Order $order): void
    {
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
}
