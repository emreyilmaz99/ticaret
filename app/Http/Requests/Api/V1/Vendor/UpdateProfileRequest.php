<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // middleware ensures authenticated vendor
    }

    public function rules(): array
    {
        $vendor = $this->user();
        $vendorId = $vendor?->getKey();

        return [
            'name' => ['sometimes','string','max:255'],
            'email' => ['sometimes','email','max:255','unique:vendors,email,' . $vendorId],
            'password' => ['sometimes','string','min:6'],
        ];
    }
}
