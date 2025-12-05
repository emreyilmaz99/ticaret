<?php

namespace App\Http\Resources\Api\V1\Vendor;

use Illuminate\Http\Resources\Json\JsonResource;

class VendorPayoutResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'fee' => $this->fee,
            'method' => $this->method,
            'status' => $this->status,
            'processed_at' => $this->processed_at,
            'reference' => $this->reference,
            'created_at' => $this->created_at,
        ];
    }
}
