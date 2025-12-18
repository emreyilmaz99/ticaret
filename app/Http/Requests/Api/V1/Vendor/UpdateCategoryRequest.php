<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:191',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Kategori adı zorunludur.',
            'name.string' => 'Kategori adı metin formatında olmalıdır.',
            'name.max' => 'Kategori adı en fazla 191 karakter olabilir.',
            'parent_id.exists' => 'Seçilen üst kategori geçersiz.',
            'description.string' => 'Açıklama metin formatında olmalıdır.',
            'is_active.boolean' => 'Aktiflik durumu geçersiz.',
            'sort_order.integer' => 'Sıralama numarası tam sayı olmalıdır.',
        ];
    }
}
