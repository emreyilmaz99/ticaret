<?php

namespace App\Http\Resources\Api\V1\Shared;

use App\Http\Resources\Api\V1\Vendor\VendorAddressResource;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'company_name' => $this->company_name,
            'slug' => $this->slug,
            'logo_path' => $this->logo_path,
            'cover_path' => $this->cover_path,
            'rating_avg' => (float) $this->rating_avg,
            'rating_count' => (int) $this->rating_count,
            'commission_rate' => (float) $this->commission_rate,
            'balance' => (float) $this->balance,
            'settings' => $this->settings,
            'addresses' => isset($this->addresses) ? VendorAddressResource::collection($this->addresses) : [],
            'created_at' => $this->created_at,
        ];
    }
}
