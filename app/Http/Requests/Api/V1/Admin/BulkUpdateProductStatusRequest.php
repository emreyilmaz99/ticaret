<?php

namespace App\Http\Requests\Api\V1\Admin;


class BulkUpdateProductStatusRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'string',
            'status' => 'required|in:pending,active,rejected,draft,inactive,banned',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'product_ids.required' => 'En az bir ürün seçilmelidir.',
            'product_ids.array' => 'Ürün ID\'leri dizi formatında olmalıdır.',
            'product_ids.min' => 'En az bir ürün seçilmelidir.',
            'status.required' => 'Durum seçimi zorunludur.',
            'status.in' => 'Geçersiz durum değeri.',
            'rejection_reason.required_if' => 'Red nedeni belirtilmelidir.',
            'rejection_reason.max' => 'Red nedeni en fazla 1000 karakter olabilir.',
        ];
    }
}
