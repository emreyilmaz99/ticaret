<?php

namespace App\Http\Resources\Api\V1\Public;

use Illuminate\Http\Resources\Json\JsonResource;

class FeaturedDealResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        $product = $this->product;
        $variant = $this->variant;

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'variant_id' => $this->variant_id,
            'title' => $this->title,
            'description' => $this->description,
            'deal_price' => (float) $this->deal_price,
            'original_price' => (float) $this->original_price,
            'discount_percentage' => (float) $this->discount_percentage,
            'background_color' => $this->background_color,
            'badge_text' => $this->badge_text,
            'badge_color' => $this->badge_color,
            'starts_at' => $this->starts_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'remaining_time' => $this->remaining_time,
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image' => $product->photos->first()?->file_path ?? '',
                'images' => $product->photos->map(fn($p) => $p->file_path)->toArray(),
                'vendor' => [
                    'id' => $product->vendor?->id,
                    'name' => $product->vendor?->company_name ?? '',
                ],
            ],
            'variant' => $variant ? [
                'id' => $variant->id,
                'title' => $variant->title,
                'sku' => $variant->sku,
                'stock' => $variant->stock,
            ] : null,
            'view_count' => $this->view_count,
            'click_count' => $this->click_count,
        ];
    }
}
