<?php

namespace App\Http\Requests\Api\V1\Admin;


class TestBannedWordsRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'text' => 'required|string|max:5000',
        ];
    }

    public function messages(): array
    {
        return [
            'text.required' => 'Test edilecek metin zorunludur.',
            'text.max' => 'Metin en fazla 5000 karakter olabilir.',
        ];
    }
}
