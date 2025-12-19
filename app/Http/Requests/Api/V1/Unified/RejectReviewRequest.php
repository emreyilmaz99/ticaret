<?php

namespace App\Http\Requests\Api\V1\Unified;

class RejectReviewRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Only admins can reject reviews
        if ($userType === 'admin') {
            return [
                'reason' => 'required|string|max:500',
            ];
        }

        return [];
    }
}
