<?php

namespace App\Http\Requests\Api\V1\Admin;


class StoreCommissionPlanRequest extends BaseAdminRequest
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
            'name' => 'required|string|max:255|unique:commission_plans,name',
            'rate' => 'required|numeric|min:0|max:100',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ];
    }

    /**
     * Get custom attribute names for validation errors
     */
    public function attributes(): array
    {
        return [
            'name' => 'plan name',
            'rate' => 'commission rate',
            'description' => 'plan description',
            'is_active' => 'active status',
            'is_default' => 'default status',
        ];
    }

    /**
     * Get custom validation messages
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The plan name is required.',
            'name.unique' => 'A commission plan with this name already exists.',
            'rate.required' => 'The commission rate is required.',
            'rate.min' => 'The commission rate must be at least 0%.',
            'rate.max' => 'The commission rate cannot exceed 100%.',
        ];
    }
}
