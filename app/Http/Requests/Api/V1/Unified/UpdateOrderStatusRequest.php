<?php

namespace App\Http\Requests\Api\V1\Unified;

class UpdateOrderStatusRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Admin and Vendor have same validation rules
        if (in_array($userType, ['admin', 'vendor'])) {
            return [
                'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
                'note' => 'nullable|string|max:500',
            ];
        }

        return []; // Users cannot update order status
    }
}
