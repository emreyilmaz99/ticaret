<?php

namespace App\Interfaces\Services\Product;

interface ProductMetadataServiceInterface
{
    public function setSetting(string $productId, string $key, $value);
    public function getSetting(string $productId, string $key, $default = null);
    public function getAllSettings(string $productId): array;
    public function setMetadata(string $productId, string $key, string $value);
    public function getMetadata(string $productId, string $key, $default = null);
    public function getAllMetadata(string $productId): array;
    public function setManySettings(string $productId, array $settings): void;
    public function setManyMetadata(string $productId, array $metadata): void;
    public function deleteSetting(string $productId, string $key): bool;
    public function deleteMetadata(string $productId, string $key): bool;
}
