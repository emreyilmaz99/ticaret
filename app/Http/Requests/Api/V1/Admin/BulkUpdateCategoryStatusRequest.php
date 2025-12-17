<?php

namespace App\Http\Requests\Api\V1\Admin;


class BulkUpdateCategoryStatusRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:categories,id',
            'is_active' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'ids.required' => 'En az bir kategori seçilmelidir.',
            'ids.min' => 'En az bir kategori seçilmelidir.',
            'ids.*.exists' => 'Seçilen kategori bulunamadı.',
            'is_active.required' => 'Durum seçimi zorunludur.',
        ];
    }
}
