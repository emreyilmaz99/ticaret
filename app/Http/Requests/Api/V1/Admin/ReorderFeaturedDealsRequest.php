<?php

namespace App\Http\Requests\Api\V1\Admin;


class ReorderFeaturedDealsRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'deals' => 'required|array',
            'deals.*.id' => 'required|exists:featured_deals,id',
            'deals.*.sort_order' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'deals.required' => 'Sıralama verisi zorunludur.',
            'deals.array' => 'Sıralama verisi dizi formatında olmalıdır.',
            'deals.*.id.required' => 'Her öğe için ID gereklidir.',
            'deals.*.id.exists' => 'Geçersiz öne çıkan ürün ID\'si.',
            'deals.*.sort_order.required' => 'Her öğe için sıralama değeri gereklidir.',
            'deals.*.sort_order.integer' => 'Sıralama değeri tam sayı olmalıdır.',
        ];
    }
}
