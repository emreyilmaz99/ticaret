<?php

namespace App\Http\Requests\Api\V1\Unified;

class UpdateProfileRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        return match($userType) {
            'user' => [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $this->user()->id,
                'phone' => 'sometimes|string|max:20',
            ],
            'vendor' => [
                'company_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:vendors,email,' . $this->user()->id,
                'phone' => 'sometimes|string|max:20',
                'tax_id' => 'sometimes|string|max:20',
                'description' => 'sometimes|string',
            ],
            'admin' => [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:admins,email,' . $this->user()->id,
            ],
            default => [],
        };
    }
}
