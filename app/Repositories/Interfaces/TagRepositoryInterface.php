<?php

namespace App\Repositories\Interfaces;

use App\Models\Tag;

interface TagRepositoryInterface
{
    public function findById(int $id): ?Tag;
    public function firstOrCreateBySlug(string $slug, array $attributes = []): Tag;
}
