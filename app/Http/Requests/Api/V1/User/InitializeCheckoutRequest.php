<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;

class InitializeCheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'shipping_address_id' => 'required|exists:user_addresses,id',
            'billing_address_id' => 'nullable|exists:user_addresses,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'shipping_address_id.required' => 'Teslimat adresi zorunludur.',
            'shipping_address_id.exists' => 'Seçilen teslimat adresi bulunamadı.',
            'billing_address_id.exists' => 'Seçilen fatura adresi bulunamadı.',
        ];
    }
}
