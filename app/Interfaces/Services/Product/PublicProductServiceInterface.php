<?php

namespace App\Interfaces\Services\Product;

use App\Core\ServiceResponse;
use Illuminate\Http\Request;

interface PublicProductServiceInterface
{
    public function getProducts(Request $request): ServiceResponse;
    public function getProductBySlug(string $slug): ServiceResponse;
    public function getRelatedProducts(string $slug, int $limit = 4): ServiceResponse;
    public function getFeaturedProducts(int $limit = 8): ServiceResponse;
    public function getMainCategories(): ServiceResponse;
}
