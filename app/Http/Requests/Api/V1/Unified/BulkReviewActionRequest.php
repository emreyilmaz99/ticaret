<?php

namespace App\Http\Requests\Api\V1\Unified;

class BulkReviewActionRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Only admins can perform bulk review actions
        if ($userType === 'admin') {
            return [
                'review_ids' => 'required|array|min:1',
                'review_ids.*' => 'required|integer|exists:reviews,id',
                'reason' => 'sometimes|string|max:500', // For bulk reject
            ];
        }

        return [];
    }
}
