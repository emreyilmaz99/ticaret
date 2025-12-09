<?php

namespace App\Services\Vendor;

use App\Services\BaseService;
use App\Models\Vendor;
use App\Models\Category;

class VendorCategoryService extends BaseService
{
    /**
     * Get vendor's selected categories
     */
    public function getMyCategories(int $vendorId)
    {
        $vendor = Vendor::find($vendorId);
        if (!$vendor) {
            return $this->errorResponse('Satıcı bulunamadı', 404);
        }

        $categories = $vendor->allowedCategories()
            ->with('parent:id,name,slug')
            ->orderBy('name')
            ->get(['categories.id', 'categories.name', 'categories.slug', 'categories.icon', 'categories.parent_id']);

        return $this->successResponse([
            'categories' => $categories,
            'total' => $categories->count()
        ]);
    }

    /**
     * Get vendor's allowed categories for product creation (selected + children)
     */
    public function getMyCategoriesForProducts(int $vendorId)
    {
        $vendor = Vendor::find($vendorId);
        if (!$vendor) {
            return $this->errorResponse('Satıcı bulunamadı', 404);
        }

        // Get vendor's selected category IDs
        $selectedCategoryIds = $vendor->allowedCategories()->pluck('categories.id')->toArray();

        if (empty($selectedCategoryIds)) {
            return $this->successResponse([
                'categories' => [],
                'total' => 0
            ]);
        }

        // Include selected categories and their children
        $allAllowedIds = collect($selectedCategoryIds);
        
        foreach ($selectedCategoryIds as $catId) {
            $children = Category::where('parent_id', $catId)
                ->pluck('id')
                ->toArray();
            $allAllowedIds = $allAllowedIds->merge($children);
        }
        
        $allAllowedIds = $allAllowedIds->unique()->values()->toArray();

        $categories = Category::whereIn('id', $allAllowedIds)
            ->with('parent:id,name,slug')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon', 'parent_id']);

        return $this->successResponse([
            'categories' => $categories,
            'total' => $categories->count()
        ]);
    }

    /**
     * Update vendor's selected categories
     */
    public function updateMyCategories(int $vendorId, array $categoryIds)
    {
        $vendor = Vendor::find($vendorId);
        if (!$vendor) {
            return $this->errorResponse('Satıcı bulunamadı', 404);
        }

        try {
            // Sync categories
            $vendor->allowedCategories()->sync($categoryIds);

            // Get updated categories
            $categories = $vendor->allowedCategories()
                ->with('parent:id,name,slug')
                ->orderBy('name')
                ->get(['categories.id', 'categories.name', 'categories.slug', 'categories.icon', 'categories.parent_id']);

            return $this->successResponse([
                'categories' => $categories,
                'total' => $categories->count()
            ], 'Kategoriler güncellendi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategoriler güncellenemedi');
        }
    }
}
