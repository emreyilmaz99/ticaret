<?php

namespace App\Http\Requests\Api\V1\Admin;


class CancelOrderRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'reason' => 'required|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'İptal nedeni zorunludur.',
            'reason.max' => 'İptal nedeni en fazla 500 karakter olabilir.',
        ];
    }
}
