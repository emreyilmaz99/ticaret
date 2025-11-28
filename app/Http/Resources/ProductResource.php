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
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', function () { return $this->category ? ['id' => $this->category->id, 'name' => $this->category->name] : null; }),
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
            'photos' => $this->whenLoaded('photos'),
            'thumbnail' => $this->whenLoaded('photos', function () { return optional($this->photos->first())->url; }),
            'variants' => $this->whenLoaded('variants'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
