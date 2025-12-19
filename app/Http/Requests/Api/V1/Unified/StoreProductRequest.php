<?php

namespace App\Http\Requests\Api\V1\Unified;

class StoreProductRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Only vendors can create products
        if ($userType === 'vendor') {
            return [
                'name' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:products,slug',
                'description' => 'required|string',
                'category_id' => 'required|integer|exists:categories,id',
                'price' => 'required|numeric|min:0',
                'compare_price' => 'nullable|numeric|min:0|gt:price',
                'cost_price' => 'nullable|numeric|min:0',
                'sku' => 'required|string|max:100|unique:products,sku',
                'barcode' => 'nullable|string|max:100',
                'stock_quantity' => 'required|integer|min:0',
                'low_stock_threshold' => 'nullable|integer|min:0',
                'weight' => 'nullable|numeric|min:0',
                'dimensions' => 'nullable|string|max:100',
                'tax_class_id' => 'nullable|integer|exists:tax_classes,id',
                'status' => 'sometimes|string|in:active,inactive,draft',
                'images' => 'nullable|array|max:10',
                'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
                'attributes' => 'nullable|array',
            ];
        }

        return [];
    }
}
