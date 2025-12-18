<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Durum bilgisi zorunludur.',
            'status.in' => 'Durum sadece aktif veya pasif olabilir.',
        ];
    }
}
