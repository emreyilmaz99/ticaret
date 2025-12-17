<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateUserRequest extends BaseAdminRequest
{
    public function authorize(): bool
    {
        return true; // authorization handled by middleware/policies later
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name' => ['sometimes','string','max:255'],
            'email' => ['sometimes','email','max:255','unique:users,email,' . $userId],
            // password update handled separately if needed
        ];
    }
}
