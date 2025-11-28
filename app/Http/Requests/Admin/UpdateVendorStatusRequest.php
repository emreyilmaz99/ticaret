<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVendorStatusRequest extends FormRequest
{
    public function authorize()
    {
        return true; // admin middleware enforces permissions
    }

    public function rules()
    {
        return [
            'status' => 'required|string|in:pre_pending,pre_approved,pre_rejected,pending,active,inactive,banned',
        ];
    }
}
