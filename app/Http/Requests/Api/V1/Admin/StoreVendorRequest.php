<?php

namespace App\Http\Requests\Api\V1\Admin;


class StoreVendorRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'name' => ['required','string','max:255'],
            'email' => ['required','email','max:255','unique:vendors,email'],
            'password' => ['required','string','min:6'],
        ];
    }
}
