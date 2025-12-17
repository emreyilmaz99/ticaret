<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdatePayoutStatusRequest extends BaseAdminRequest
{
    public function authorize(): bool
    {
        return true; // authorization handled by middleware
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:pending,approved,rejected,processed'
        ];
    }
}
