<?php

namespace App\Http\Resources\Api\V1\Shared;

use App\Http\Resources\Api\V1\Vendor\VendorAddressResource;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    public function toArray($request): array
    {
        // Logo ve cover path'lerini media'dan al
        $logoMedia = $this->media?->where('type', 'logo')->first();
        $coverMedia = $this->media?->where('type', 'cover')->first();
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'company_name' => $this->company_name,
            'slug' => $this->slug,
            'logo_path' => $logoMedia?->path ?? $this->logo_path,
            'cover_path' => $coverMedia?->path ?? $this->cover_path,
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
