<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVendorCategoriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'category_ids.required' => 'En az bir kategori seçmelisiniz.',
            'category_ids.array' => 'Kategori listesi dizi formatında olmalıdır.',
            'category_ids.min' => 'En az bir kategori seçmelisiniz.',
            'category_ids.*.exists' => 'Geçersiz kategori seçimi.',
        ];
    }
}
