<?php

namespace App\Http\Requests\Api\V1\Unified;

class StoreReviewResponseRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Only vendors can respond to reviews
        if ($userType === 'vendor') {
            return [
                'response' => 'required|string|max:1000',
            ];
        }

        return [];
    }
}
