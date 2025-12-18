<?php

namespace App\Interfaces\Services\Product;

use App\Models\Product;
use Illuminate\Http\Request;

interface ProductCatalogServiceInterface
{
    /**
     * Get public products with filters
     */
    public function getPublicProducts(Request $request);

    /**
     * Get featured products
     */
    public function getFeaturedProducts(int $limit = 8);

    /**
     * Get related products
     */
    public function getRelatedProducts(Product $product, int $limit = 4);

    /**
     * Get product by slug
     */
    public function getBySlug(string $slug);

    /**
     * Increment product views
     */
    public function incrementViews(int $productId): void;
}
