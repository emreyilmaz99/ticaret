<?php

namespace App\Interfaces\Services\Product;

use App\Core\ServiceResponse;

interface SearchServiceInterface
{
    public function searchProducts(string $query): ServiceResponse;
    
    public function advancedSearch(array $filters): ServiceResponse;
}
