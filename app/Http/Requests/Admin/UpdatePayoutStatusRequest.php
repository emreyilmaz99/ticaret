<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePayoutStatusRequest extends FormRequest
{
    public function authorize()
    {
        return true; // authorization handled by middleware
    }

    public function rules()
    {
        return [
            'status' => 'required|string|in:pending,approved,rejected,processed'
        ];
    }
}
