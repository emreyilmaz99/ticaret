<?php

namespace App\Http\Requests\Api\V1\Admin;


class RejectReviewRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        return [
            'rejection_reason' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'rejection_reason.max' => 'Ret nedeni en fazla 500 karakter olabilir.',
        ];
    }
}
