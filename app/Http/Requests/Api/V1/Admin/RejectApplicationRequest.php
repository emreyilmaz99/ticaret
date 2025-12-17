<?php

namespace App\Http\Requests\Api\V1\Admin;


class RejectApplicationRequest extends BaseAdminRequest
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
            'rejection_reason' => 'required|string|min:10|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'rejection_reason.required' => 'Please provide a reason for rejection',
            'rejection_reason.min' => 'Rejection reason must be at least 10 characters',
        ];
    }
}
