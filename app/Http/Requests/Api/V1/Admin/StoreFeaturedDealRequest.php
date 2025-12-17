<?php

namespace App\Http\Requests\Api\V1\Admin;


class StoreFeaturedDealRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'deal_price' => 'required|numeric|min:0',
            'original_price' => 'required|numeric|min:0|gt:deal_price',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'background_color' => 'nullable|string|max:20',
            'badge_text' => 'nullable|string|max:50',
            'badge_color' => 'nullable|string|max:20',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Ürün seçimi zorunludur.',
            'product_id.exists' => 'Seçilen ürün bulunamadı.',
            'deal_price.required' => 'İndirimli fiyat zorunludur.',
            'deal_price.min' => 'İndirimli fiyat 0 veya daha büyük olmalıdır.',
            'original_price.required' => 'Orijinal fiyat zorunludur.',
            'original_price.gt' => 'Orijinal fiyat, indirimli fiyattan büyük olmalıdır.',
            'title.required' => 'Başlık zorunludur.',
            'ends_at.after' => 'Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.',
        ];
    }
}
