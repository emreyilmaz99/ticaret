<?php

namespace App\Http\Requests\Api\V1\Admin;


class LoginRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'email' => ['required','email'],
            'password' => ['required','string'],
        ];
    }
}
