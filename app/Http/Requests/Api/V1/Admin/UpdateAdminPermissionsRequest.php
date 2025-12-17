<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateAdminPermissionsRequest extends BaseAdminRequest
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
