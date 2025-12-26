<?php

namespace App\Repositories\Interfaces;

use App\Models\TaxClass;
use Illuminate\Database\Eloquent\Collection;

interface TaxClassRepositoryInterface
{
    public function find(int $id): ?TaxClass;
    public function findWithProductCount(int $id): ?TaxClass;
    public function getAll(array $filters = []): Collection;
    public function getActive(): Collection;
    public function getDefault(): ?TaxClass;
    public function create(array $data): TaxClass;
    public function update(int $id, array $data): TaxClass;
    public function delete(int $id): bool;
    public function clearDefaultExcept(?int $exceptId = null): int;
    public function getProductCount(int $id): int;
}
