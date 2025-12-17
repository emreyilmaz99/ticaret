<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateOrderStatusRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,returned',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Sipariş durumu zorunludur.',
            'status.in' => 'Geçersiz sipariş durumu.',
        ];
    }
}
