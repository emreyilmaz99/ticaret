<?php

namespace App\Http\Requests\Api\V1\PublicRequests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'quantity' => 'required|integer|min:1|max:99',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'quantity.required' => 'Miktar gereklidir.',
            'quantity.min' => 'Miktar en az 1 olmalıdır.',
            'quantity.max' => 'Miktar en fazla 99 olabilir.',
        ];
    }
}
