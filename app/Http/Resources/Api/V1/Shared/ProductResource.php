<?php

namespace App\Http\Resources\Api\V1\Shared;

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
            'vendor' => $this->whenLoaded('vendor', function () { 
                return $this->vendor ? [
                    'id' => $this->vendor->id, 
                    'company_name' => $this->vendor->company_name,
                    'full_name' => $this->vendor->full_name,
                    'email' => $this->vendor->email,
                ] : null; 
            }),
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', function () { return $this->category ? ['id' => $this->category->id, 'name' => $this->category->name] : null; }),
            'tax_class_id' => $this->tax_class_id,
            'tax_class' => $this->whenLoaded('taxClass', function () { 
                return $this->taxClass ? [
                    'id' => $this->taxClass->id, 
                    'name' => $this->taxClass->name,
                    'rate' => $this->taxClass->rate
                ] : null; 
            }),
            'sku' => $this->sku,
            'slug' => $this->slug,
            'name' => $this->name,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'type' => $this->type,
            'status' => $this->status,
            'price' => $this->price ?? $this->variants->first()?->price,
            'stock' => $this->variants->sum('stock'),
            'compare_at_price' => $this->compare_at_price,
            'is_featured' => $this->is_featured,
            'media' => $this->whenLoaded('media'),
            'photos' => $this->whenLoaded('photos', function () {
                return $this->photos->map(function ($photo) {
                    return [
                        'id' => $photo->id,
                        'url' => $photo->file_path,
                        'alt' => $photo->alt,
                        'sort_order' => $photo->sort_order,
                    ];
                });
            }),
            'thumbnail' => $this->whenLoaded('photos', function () { 
                $photo = $this->photos->sortBy('sort_order')->first();
                return $photo ? $photo->file_path : null;
            }),
            'variants' => $this->whenLoaded('variants'),
            'tags' => $this->whenLoaded('tags'),
            'rejection_reason' => $this->rejection_reason,
            'rejected_at' => $this->rejected_at,
            'rejected_by' => $this->rejected_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
