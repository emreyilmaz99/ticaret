<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateFeaturedDealRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'product_id' => 'sometimes|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'deal_price' => 'sometimes|numeric|min:0',
            'original_price' => 'sometimes|numeric|min:0',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'background_color' => 'nullable|string|max:20',
            'badge_text' => 'nullable|string|max:50',
            'badge_color' => 'nullable|string|max:20',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.exists' => 'Seçilen ürün bulunamadı.',
            'deal_price.min' => 'İndirimli fiyat 0 veya daha büyük olmalıdır.',
        ];
    }
}
