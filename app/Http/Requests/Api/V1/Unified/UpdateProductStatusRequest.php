<?php

namespace App\Http\Requests\Api\V1\Unified;

class UpdateProductStatusRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Both vendor and admin can update product status
        if (in_array($userType, ['vendor', 'admin'])) {
            return [
                'status' => 'required|string|in:active,inactive,draft,pending,rejected',
                'rejection_reason' => 'required_if:status,rejected|string|max:500',
            ];
        }

        return [];
    }
}
