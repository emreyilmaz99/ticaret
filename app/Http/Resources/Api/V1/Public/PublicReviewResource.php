<?php

namespace App\Http\Resources\Api\V1\Public;

use Illuminate\Http\Resources\Json\JsonResource;

class PublicReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'is_anonymous' => $this->is_anonymous,
            'is_verified_purchase' => $this->is_verified_purchase,
            'helpful_count' => $this->helpful_count,
            'unhelpful_count' => $this->unhelpful_count,
            'created_at' => $this->created_at->format('Y-m-d'),
            'user' => $this->is_anonymous ? null : [
                'name' => $this->user->name,
                'avatar' => $this->user->avatar_url ?? null,
            ],
            'product' => $this->when(isset($this->product), function() {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'slug' => $this->product->slug,
                    'image' => $this->product->photos->first()?->path
                        ? url('/storage/' . $this->product->photos->first()->path)
                        : null,
                ];
            }),
            'media' => $this->when(isset($this->media), function() {
                return $this->media->map(function ($media) {
                    return [
                        'type' => $media->type,
                        'url' => url('/storage/' . $media->path),
                    ];
                });
            }),
        ];
    }
}
