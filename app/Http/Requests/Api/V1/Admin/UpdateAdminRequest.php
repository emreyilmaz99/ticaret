<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $adminId = $this->route('admin');
        $adminId = is_object($adminId) && method_exists($adminId, 'getKey') ? $adminId->getKey() : $adminId;

        return [
            'name' => ['sometimes','string','max:255'],
            'email' => ['sometimes','email','max:255','unique:admins,email,' . $adminId],
            'password' => ['sometimes','string','min:6'],
            'roles' => ['sometimes','array'],
            'roles.*' => ['string'],
            'primary_role' => ['sometimes','string','max:100','nullable',\Illuminate\Validation\Rule::in(\App\Models\Admin::PRIMARY_ROLES)],
            'is_active' => ['sometimes','boolean'],
        ];
    }
}
