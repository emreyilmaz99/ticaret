<?php

namespace App\Http\Resources\Api\V1\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'primary_role' => $this->primary_role ?? null,
            'roles' => $this->whenLoaded('roles', fn() => $this->roles->pluck('name')),
            'is_active' => (bool) ($this->is_active ?? true),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
