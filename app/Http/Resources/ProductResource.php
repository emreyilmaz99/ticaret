<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'vendor_id' => $this->vendor_id,
            'sku' => $this->sku,
            'slug' => $this->slug,
            'name' => $this->name,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'type' => $this->type,
            'status' => $this->status,
            'price' => $this->price,
            'compare_at_price' => $this->compare_at_price,
            'is_featured' => $this->is_featured,
            'media' => $this->whenLoaded('media'),
            'variants' => $this->whenLoaded('variants'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
