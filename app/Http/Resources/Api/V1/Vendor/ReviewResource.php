<?php

namespace App\Http\Resources\Api\V1\Vendor;

use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'user_id' => $this->user_id,
            'order_item_id' => $this->order_item_id,
            'rating' => $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'status' => $this->status,
            'helpful_count' => $this->helpful_count,
            'not_helpful_count' => $this->not_helpful_count,
            'verified_purchase' => $this->verified_purchase,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'user' => $this->when($this->relationLoaded('user'), $this->formatUser()),
            'product' => $this->when($this->relationLoaded('product'), $this->formatProduct()),
            'has_media' => $this->when($this->relationLoaded('media'), $this->media ? $this->media->isNotEmpty() : false),
            'has_response' => $this->when($this->relationLoaded('response'), $this->response !== null),
            'response' => $this->when($this->relationLoaded('response'), $this->formatResponse()),
        ];
    }

    protected function formatUser(): ?array
    {
        if (!$this->user) {
            return null;
        }

        return [
            'id' => $this->user->id,
            'name' => $this->user->name,
            'avatar' => $this->user->avatar_url ?? null,
        ];
    }

    protected function formatProduct(): ?array
    {
        if (!$this->product) {
            return null;
        }

        return [
            'id' => $this->product->id,
            'name' => $this->product->name,
            'slug' => $this->product->slug,
            'image' => $this->product->image ?? null, // Main product image from accessor
        ];
    }

    protected function formatResponse(): ?array
    {
        if (!$this->response) {
            return null;
        }

        return [
            'id' => $this->response->id,
            'response_text' => $this->response->response_text,
            'created_at' => $this->response->created_at?->toISOString(),
            'updated_at' => $this->response->updated_at?->toISOString(),
        ];
    }
}
