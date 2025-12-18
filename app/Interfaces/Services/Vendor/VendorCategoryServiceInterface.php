<?php

namespace App\Interfaces\Services\Vendor;

interface VendorCategoryServiceInterface
{
    public function getMyCategories(int $vendorId);
    public function getMyCategoriesForProducts(int $vendorId);
    public function updateMyCategories(int $vendorId, array $categoryIds);
}
