<?php

namespace App\Repositories;

use App\Models\Tag;
use App\Repositories\Interfaces\TagRepositoryInterface;

class TagRepository implements TagRepositoryInterface
{
    protected Tag $model;

    public function __construct(Tag $model)
    {
        $this->model = $model;
    }

    public function findById(int $id): ?Tag
    {
        return $this->model->find($id);
    }

    public function firstOrCreateBySlug(string $slug, array $attributes = []): Tag
    {
        return $this->model->firstOrCreate(['slug' => $slug], $attributes);
    }
}
