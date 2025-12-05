<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePayoutStatusRequest extends FormRequest
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
