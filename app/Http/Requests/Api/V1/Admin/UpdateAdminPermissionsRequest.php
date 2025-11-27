<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminPermissionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // middleware will enforce super-admin
    }

    public function rules(): array
    {
        return [
            'permissions' => ['required','array'],
            'permissions.*' => ['string'],
        ];
    }
}
