<?php

namespace App\Http\Requests\Api\V1\Unified;

class StoreAddressRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // User and Vendor have same address validation rules
        if (in_array($userType, ['user', 'vendor'])) {
            return [
                'title' => 'required|string|max:100',
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'phone' => 'required|string|max:20',
                'city' => 'required|string|max:100',
                'district' => 'required|string|max:100',
                'address' => 'required|string|max:500',
                'postal_code' => 'nullable|string|max:10',
                'is_default' => 'sometimes|boolean',
            ];
        }

        return []; // Admins don't have addresses
    }
}
