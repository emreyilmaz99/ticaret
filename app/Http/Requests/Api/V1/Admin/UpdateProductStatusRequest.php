<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateProductStatusRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,active,rejected,draft,inactive,banned',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Durum seçimi zorunludur.',
            'status.in' => 'Geçersiz durum değeri.',
            'rejection_reason.required_if' => 'Red nedeni belirtilmelidir.',
            'rejection_reason.max' => 'Red nedeni en fazla 1000 karakter olabilir.',
        ];
    }
}
