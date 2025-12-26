<?php

namespace App\Traits;

use App\Models\ProductVariant;
use App\Exceptions\InsufficientStockException;

/**
 * Trait ManagesVariantStock
 * 
 * Shared variant validation and stock management helpers
 */
trait ManagesVariantStock
{
    /**
     * Validate variant exists
     * 
     * @throws \Exception
     */
    protected function validateVariant(int $variantId): ProductVariant
    {
        $variant = $this->variantRepo->findById($variantId);
        
        if (!$variant) {
            throw new \Exception('Variant not found');
        }
        
        return $variant;
    }

    /**
     * Validate stock amount
     * 
     * @throws \InvalidArgumentException
     */
    protected function validateStockAmount(int $amount, int $maxStock = 999999): void
    {
        if ($amount < 0) {
            throw new \InvalidArgumentException('Stock amount cannot be negative');
        }

        if ($amount > $maxStock) {
            throw new \InvalidArgumentException('Stock amount exceeds maximum limit');
        }
    }

    /**
     * Validate sufficient stock
     * 
     * @throws InsufficientStockException
     */
    protected function validateSufficientStock(ProductVariant $variant, int $amount): void
    {
        if ($variant->stock < $amount) {
            throw new InsufficientStockException(
                'Variant #' . $variant->id,
                $variant->stock,
                $amount
            );
        }
    }

    /**
     * Generate unique SKU for product variant
     */
    protected function generateSKU(string $productSlug, ?array $attributes = null): string
    {
        $sku = strtoupper($productSlug);
        
        // Add attribute codes if provided
        if ($attributes) {
            $attributeCodes = collect($attributes)
                ->map(fn($attr) => strtoupper(substr($attr, 0, 3)))
                ->implode('-');
            $sku .= '-' . $attributeCodes;
        }
        
        // Add timestamp and random suffix for uniqueness
        $sku .= '-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -4));
        
        return $sku;
    }

    /**
     * Calculate new stock after operation
     */
    protected function calculateNewStock(int $currentStock, int $amount, string $operation): int
    {
        return $operation === 'increment' 
            ? $currentStock + $amount 
            : $currentStock - $amount;
    }

    /**
     * Get cache key for product variants
     */
    protected function getVariantsCacheKey(string $productId): string
    {
        return "product:{$productId}:variants";
    }
}
