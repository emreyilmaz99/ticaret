<?php

namespace App\Http\Requests\Api\V1\Unified;

class UpdateProductRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Only vendors can update products
        if ($userType === 'vendor') {
            $productId = $this->route('id');
            
            return [
                'name' => 'sometimes|string|max:255',
                'slug' => 'sometimes|string|max:255|unique:products,slug,' . $productId,
                'description' => 'sometimes|string',
                'category_id' => 'sometimes|integer|exists:categories,id',
                'price' => 'sometimes|numeric|min:0',
                'compare_price' => 'nullable|numeric|min:0',
                'cost_price' => 'nullable|numeric|min:0',
                'sku' => 'sometimes|string|max:100|unique:products,sku,' . $productId,
                'barcode' => 'nullable|string|max:100',
                'stock_quantity' => 'sometimes|integer|min:0',
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
