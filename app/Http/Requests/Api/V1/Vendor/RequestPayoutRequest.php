<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class RequestPayoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:0.01',
            'fee' => 'nullable|numeric|min:0',
            'method' => 'nullable|string|max:100',
            'reference' => 'nullable|string|max:255',
        ];
    }
}
