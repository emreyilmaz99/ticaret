<?php

namespace App\Http\Requests\Api\V1\Admin;


class StoreAdminRequest extends BaseAdminRequest
{
    public function authorize(): bool
    {
        return true; // authorization handled by middleware
    }

    public function rules(): array
    {
        return [
            'name' => ['required','string','max:255'],
            'email' => ['required','email','max:255','unique:admins,email'],
            'password' => ['required','string','min:6'],
            'roles' => ['sometimes','array'],
            'roles.*' => ['string'],
            'primary_role' => ['sometimes','string','max:100','nullable',\Illuminate\Validation\Rule::in(\App\Models\Admin::PRIMARY_ROLES)],
            'is_active' => ['sometimes','boolean'],
        ];
    }
}
