<?php

namespace App\Http\Resources\Api\V1\Vendor;

use Illuminate\Http\Resources\Json\JsonResource;

class VendorEarningResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'order_number' => $this->order->order_number ?? null,
            'order_date' => $this->order?->created_at?->toISOString(),
            'product_name' => $this->orderItem?->product_name,
            'product_quantity' => $this->orderItem?->quantity,
            'gross_amount' => (float) $this->gross_amount,
            'commission_rate' => (float) $this->commission_rate,
            'commission_amount' => (float) $this->commission_amount,
            'withholding_tax_rate' => (float) $this->withholding_tax_rate,
            'withholding_tax_amount' => (float) $this->withholding_tax_amount,
            'net_earning' => (float) $this->net_earning,
            'formatted_net_earning' => $this->formatted_net_earning,
            'status' => $this->earning_status,
            'status_label' => $this->status_label,
            'available_at' => $this->available_at?->toISOString(),
            'settled_at' => $this->settled_at?->toISOString(),
            'payout_id' => $this->payout_id,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
