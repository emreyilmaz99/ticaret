<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVendorStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // admin middleware enforces permissions
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:active,inactive,suspended,banned',
        ];
    }
}
