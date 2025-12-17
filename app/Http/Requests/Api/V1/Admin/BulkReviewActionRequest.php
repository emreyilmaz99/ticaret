<?php

namespace App\Http\Requests\Api\V1\Admin;


class BulkReviewActionRequest extends BaseAdminRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'review_ids' => ['required', 'array', 'min:1'],
            'review_ids.*' => ['exists:product_reviews,id'],
            'rejection_reason' => ['required_if:action,reject', 'string', 'max:500'],
        ];
    }
}
