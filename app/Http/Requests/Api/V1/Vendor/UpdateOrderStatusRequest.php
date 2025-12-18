<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded',
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
