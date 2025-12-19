<?php

namespace App\Repositories;

use App\Models\ProductSetting;
use App\Repositories\Interfaces\ProductSettingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductSettingRepository extends EloquentBaseRepository implements ProductSettingRepositoryInterface
{
    public function __construct(ProductSetting $model)
    {
        parent::__construct($model);
    }

    public function create(array $data): ProductSetting
    {
        return $this->model->create($data);
    }

    public function update($id, array $data): ProductSetting
    {
        $record = $this->model->findOrFail($id);
        $record->update($data);
        return $record;
    }

    public function findById(int $id): ?ProductSetting
    {
        return $this->model->find($id);
    }

    public function findByProductAndKey(string $productId, string $key): ?ProductSetting
    {
        return $this->model->where('product_id', $productId)
            ->where('setting_key', $key)
            ->first();
    }

    public function listByProduct(string $productId): Collection
    {
        return $this->model->where('product_id', $productId)->get();
    }

    public function upsert(string $productId, string $key, $value): ProductSetting
    {
        $setting = $this->findByProductAndKey($productId, $key);
        
        if ($setting) {
            $setting->setTypedValue($value);
            $setting->save();
            return $setting;
        }
        
        $setting = new ProductSetting([
            'product_id' => $productId,
            'setting_key' => $key,
        ]);
        $setting->setTypedValue($value);
        $setting->save();
        
        return $setting;
    }

    public function deleteByProductAndKey(string $productId, string $key): bool
    {
        return (bool) $this->model->where('product_id', $productId)
            ->where('setting_key', $key)
            ->delete();
    }
}
