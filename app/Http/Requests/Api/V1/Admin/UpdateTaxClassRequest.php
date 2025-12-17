<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateTaxClassRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        $taxClassId = $this->route('taxClass') ?? $this->route('id');
        
        return [
            'name' => 'sometimes|string|max:255|unique:tax_classes,name,' . $taxClassId,
            'rate' => 'sometimes|numeric|min:0|max:100',
            'description' => 'nullable|string',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Bu vergi sınıfı adı zaten kullanılıyor.',
            'rate.min' => 'Vergi oranı 0 veya daha büyük olmalıdır.',
            'rate.max' => 'Vergi oranı en fazla 100 olabilir.',
        ];
    }
}
