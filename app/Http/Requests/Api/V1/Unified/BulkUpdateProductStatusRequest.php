<?php

namespace App\Http\Requests\Api\V1\Unified;

class BulkUpdateProductStatusRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Only admins can bulk update product status
        if ($userType === 'admin') {
            return [
                'product_ids' => 'required|array|min:1',
                'product_ids.*' => 'required|integer|exists:products,id',
                'status' => 'required|string|in:active,inactive,pending,rejected',
                'rejection_reason' => 'required_if:status,rejected|string|max:500',
            ];
        }

        return [];
    }
}
