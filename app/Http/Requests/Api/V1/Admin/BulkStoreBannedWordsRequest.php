<?php

namespace App\Http\Requests\Api\V1\Admin;


class BulkStoreBannedWordsRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'words' => 'required|array|min:1',
            'words.*' => 'string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'words.required' => 'En az bir kelime girilmelidir.',
            'words.array' => 'Kelimeler dizi formatında olmalıdır.',
            'words.min' => 'En az bir kelime girilmelidir.',
            'words.*.max' => 'Her kelime en fazla 100 karakter olabilir.',
        ];
    }
}
