<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;

/**
 * CreateOrderRequest
 * 
 * Validates order creation from cart.
 * Ensures all required data is present before calling OrderCreationService.
 */
class CreateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request
     * 
     * Rules:
     * - cart_id: Optional, defaults to user's active cart
     * - shipping_address_id: Required, must exist and belong to user
     * - billing_address_id: Optional, defaults to shipping_address_id
     * - use_wallet: Optional boolean for wallet payment
     * 
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $userId = $this->user()?->id ?? 0;
        
        return [
            'cart_id' => [
                'sometimes',
                'integer',
                'exists:carts,id,user_id,' . $userId,
            ],
            'shipping_address_id' => [
                'required',
                'integer',
                'exists:user_addresses,id,user_id,' . $userId,
            ],
            'billing_address_id' => [
                'sometimes',
                'integer',
                'exists:user_addresses,id,user_id,' . $userId,
            ],
            'use_wallet' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors
     * 
     * @return array
     */
    public function messages(): array
    {
        return [
            'cart_id.exists' => 'Geçersiz sepet seçildi.',
            'shipping_address_id.required' => 'Teslimat adresi seçilmesi zorunludur.',
            'shipping_address_id.exists' => 'Seçilen teslimat adresi bulunamadı.',
            'billing_address_id.exists' => 'Seçilen fatura adresi bulunamadı.',
        ];
    }

    /**
     * Get custom attribute names for validator errors
     * 
     * @return array
     */
    public function attributes(): array
    {
        return [
            'cart_id' => 'sepet',
            'shipping_address_id' => 'teslimat adresi',
            'billing_address_id' => 'fatura adresi',
            'use_wallet' => 'cüzdan kullanımı',
        ];
    }
}
