<?php

namespace App\Http\Requests\Api\V1\Admin;


class StoreTaxClassRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:tax_classes,name',
            'rate' => 'required|numeric|min:0|max:100',
            'description' => 'nullable|string',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Vergi sınıfı adı zorunludur.',
            'name.unique' => 'Bu vergi sınıfı adı zaten kullanılıyor.',
            'rate.required' => 'Vergi oranı zorunludur.',
            'rate.min' => 'Vergi oranı 0 veya daha büyük olmalıdır.',
            'rate.max' => 'Vergi oranı en fazla 100 olabilir.',
        ];
    }
}
