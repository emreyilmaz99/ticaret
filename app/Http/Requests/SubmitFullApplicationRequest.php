<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitFullApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public endpoint
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|regex:/^[a-z0-9-]+$/',
            'phone' => 'required|string|max:20',
            'tax_id' => 'nullable|string|max:50',
            'address_line' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Full name is required',
            'company_name.required' => 'Company name is required',
            'slug.required' => 'Store slug is required',
            'slug.regex' => 'Slug can only contain lowercase letters, numbers and hyphens',
            'phone.required' => 'Phone number is required',
            'address_line.required' => 'Address is required',
            'city.required' => 'City is required',
            'country.required' => 'Country is required',
        ];
    }
}
