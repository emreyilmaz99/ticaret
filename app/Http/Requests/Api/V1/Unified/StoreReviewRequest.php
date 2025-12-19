<?php

namespace App\Http\Requests\Api\V1\Unified;

class StoreReviewRequest extends UnifiedFormRequest
{
    /**
     * Get validation rules based on user type
     */
    protected function rulesForUserType(string $userType): array
    {
        // Only users can create reviews
        if ($userType === 'user') {
            return [
                'rating' => 'required|integer|min:1|max:5',
                'title' => 'required|string|max:200',
                'comment' => 'required|string|max:1000',
                'images' => 'nullable|array|max:5',
                'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            ];
        }

        return [];
    }
}
