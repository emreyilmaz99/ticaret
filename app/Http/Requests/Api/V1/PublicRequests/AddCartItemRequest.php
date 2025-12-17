<?php

namespace App\Http\Requests\Api\V1\PublicRequests;

use Illuminate\Foundation\Http\FormRequest;

class AddCartItemRequest extends FormRequest
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
            'product_id' => 'required|string|exists:products,id',
            'variant_id' => 'nullable|integer|exists:product_variants,id',
            'quantity' => 'nullable|integer|min:1|max:99',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Ürün ID\'si gereklidir.',
            'product_id.exists' => 'Ürün bulunamadı.',
            'variant_id.exists' => 'Ürün varyantı bulunamadı.',
            'quantity.min' => 'Miktar en az 1 olmalıdır.',
            'quantity.max' => 'Miktar en fazla 99 olabilir.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default quantity if not provided
        if (!$this->has('quantity')) {
            $this->merge(['quantity' => 1]);
        }
    }
}
