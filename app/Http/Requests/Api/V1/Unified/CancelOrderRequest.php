<?php

namespace App\Http\Requests\Api\V1\Unified;

class CancelOrderRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        return match($userType) {
            'admin' => [
                'reason' => 'required|string|max:500',
                'notify_customer' => 'sometimes|boolean',
            ],
            'vendor' => [
                'reason' => 'required|string|max:500',
            ],
            'user' => [
                'reason' => 'sometimes|string|max:500',
            ],
            default => [],
        };
    }
}
