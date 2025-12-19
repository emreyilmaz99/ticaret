<?php

namespace App\Http\Requests\Api\V1\Unified;

class UpdateAddressRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // User and Vendor have same address validation rules
        if (in_array($userType, ['user', 'vendor'])) {
            return [
                'title' => 'sometimes|string|max:100',
                'first_name' => 'sometimes|string|max:100',
                'last_name' => 'sometimes|string|max:100',
                'phone' => 'sometimes|string|max:20',
                'city' => 'sometimes|string|max:100',
                'district' => 'sometimes|string|max:100',
                'address' => 'sometimes|string|max:500',
                'postal_code' => 'nullable|string|max:10',
                'is_default' => 'sometimes|boolean',
            ];
        }

        return []; // Admins don't have addresses
    }
}
