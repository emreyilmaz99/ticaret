<?php

namespace App\Http\Requests\Api\V1\Admin;


class AddOrderNoteRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'note' => 'required|string|max:1000',
            'is_visible_to_vendor' => 'boolean',
            'is_visible_to_customer' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'note.required' => 'Not içeriği zorunludur.',
            'note.max' => 'Not en fazla 1000 karakter olabilir.',
        ];
    }
}
