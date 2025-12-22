<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVendorAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'address_line' => 'required|string|max:1000',
            'postal_code' => 'nullable|string|max:50',
            'is_primary' => 'sometimes|boolean',
        ];
    }
}
