<?php

namespace App\Http\Resources\Api\V1\Shared;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * AddressSnapshotResource
 * 
 * Creates immutable address snapshot for order storage.
 * Address data is stored as JSON in Order model to preserve historical accuracy.
 * Even if user changes/deletes address later, order shows original address.
 * 
 * @property \App\Models\UserAddress $resource
 */
class AddressSnapshotResource extends JsonResource
{
    /**
     * Transform UserAddress to snapshot array format
     * 
     * This format is stored in Order.shipping_address and Order.billing_address JSON columns.
     * Contains all necessary fields for invoice and shipping label generation.
     * 
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'country' => $this->country,
            'city' => $this->city,
            'district' => $this->district,
            'neighborhood' => $this->neighborhood,
            'address_line' => $this->address_line,
            'postal_code' => $this->postal_code,
        ];
    }
}
