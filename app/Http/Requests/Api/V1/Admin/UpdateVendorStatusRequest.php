<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateVendorStatusRequest extends BaseAdminRequest
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
