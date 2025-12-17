<?php

namespace App\Http\Requests\Api\V1\PublicRequests;

use Illuminate\Foundation\Http\FormRequest;

class CalculateTaxRequest extends FormRequest
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
            'tax_class_id' => 'required|exists:tax_classes,id',
            'price' => 'required|numeric|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'tax_class_id.required' => 'Vergi sınıfı gereklidir.',
            'tax_class_id.exists' => 'Vergi sınıfı bulunamadı.',
            'price.required' => 'Fiyat gereklidir.',
            'price.min' => 'Fiyat sıfırdan küçük olamaz.',
        ];
    }
}
