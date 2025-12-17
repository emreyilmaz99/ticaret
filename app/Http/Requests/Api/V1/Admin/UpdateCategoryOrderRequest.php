<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateCategoryOrderRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.sort_order' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'categories.required' => 'Kategori sıralama verisi zorunludur.',
            'categories.*.id.required' => 'Kategori ID\'si gereklidir.',
            'categories.*.id.exists' => 'Kategori bulunamadı.',
            'categories.*.sort_order.required' => 'Sıralama değeri gereklidir.',
            'categories.*.sort_order.integer' => 'Sıralama değeri tam sayı olmalıdır.',
        ];
    }
}
