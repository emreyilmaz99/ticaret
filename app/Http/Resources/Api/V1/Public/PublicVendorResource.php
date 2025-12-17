<?php

namespace App\Http\Resources\Api\V1\Public;

use Illuminate\Http\Resources\Json\JsonResource;

class PublicVendorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'company_name' => $this->company_name,
            'business_name' => $this->business_name ?? $this->company_name,
            'slug' => $this->slug,
            'description' => $this->description,
            'logo' => $this->logo ? url('/storage/' . $this->logo) : null,
            'banner' => $this->banner ? url('/storage/' . $this->banner) : null,
            'city' => $this->city,
            'district' => $this->district,
            'rating_avg' => (float)($this->rating_avg ?? 0),
            'review_count' => (int)($this->review_count ?? 0),
            'created_at' => $this->created_at?->format('Y-m-d'),
            'member_since' => $this->created_at?->year,
        ];
    }
}
