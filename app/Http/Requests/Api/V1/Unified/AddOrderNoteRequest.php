<?php

namespace App\Http\Requests\Api\V1\Unified;

class AddOrderNoteRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Only admins can add order notes
        if ($userType === 'admin') {
            return [
                'note' => 'required|string|max:1000',
                'is_customer_notified' => 'sometimes|boolean',
            ];
        }

        return [];
    }
}
