<?php

namespace App\Repositories\Interfaces;

use App\Models\ProductSetting;
use Illuminate\Database\Eloquent\Collection;

interface ProductSettingRepositoryInterface
{
    public function create(array $data): ProductSetting;
    public function update(int $id, array $data): ProductSetting;
    public function findById(int $id): ?ProductSetting;
    public function delete(int $id): bool;
    public function findByProductAndKey(string $productId, string $key): ?ProductSetting;
    public function listByProduct(string $productId): Collection;
    public function upsert(string $productId, string $key, $value): ProductSetting;
    public function deleteByProductAndKey(string $productId, string $key): bool;
}
