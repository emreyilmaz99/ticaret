<?php

namespace App\Interfaces\Services\Product;

interface ProductMetadataServiceInterface
{
    public function setSetting(int $productId, string $key, $value);
    public function getSetting(int $productId, string $key, $default = null);
    public function getAllSettings(int $productId): array;
    public function setMetadata(int $productId, string $key, string $value);
    public function getMetadata(int $productId, string $key, $default = null);
    public function getAllMetadata(int $productId): array;
    public function setManySettings(int $productId, array $settings): void;
    public function setManyMetadata(int $productId, array $metadata): void;
    public function deleteSetting(int $productId, string $key): bool;
    public function deleteMetadata(int $productId, string $key): bool;
}
