<?php

namespace App\Http\Requests\Api\V1\Admin;


class BulkDestroyBannedWordsRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:banned_words,id',
        ];
    }

    public function messages(): array
    {
        return [
            'ids.required' => 'En az bir ID seçilmelidir.',
            'ids.array' => 'ID\'ler dizi formatında olmalıdır.',
            'ids.min' => 'En az bir ID seçilmelidir.',
            'ids.*.exists' => 'Seçilen kayıtlardan biri bulunamadı.',
        ];
    }
}
