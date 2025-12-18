<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShippingSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_cost' => 'required|numeric|min:0|max:9999.99',
            'free_shipping_threshold' => 'required|numeric|min:0|max:99999.99',
            'is_shipping_enabled' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'shipping_cost.required' => 'Kargo ücreti zorunludur.',
            'shipping_cost.numeric' => 'Kargo ücreti sayısal bir değer olmalıdır.',
            'shipping_cost.min' => 'Kargo ücreti 0 veya daha büyük olmalıdır.',
            'shipping_cost.max' => 'Kargo ücreti çok yüksek.',
            'free_shipping_threshold.required' => 'Ücretsiz kargo limiti zorunludur.',
            'free_shipping_threshold.numeric' => 'Ücretsiz kargo limiti sayısal bir değer olmalıdır.',
            'free_shipping_threshold.min' => 'Ücretsiz kargo limiti 0 veya daha büyük olmalıdır.',
            'free_shipping_threshold.max' => 'Ücretsiz kargo limiti çok yüksek.',
            'is_shipping_enabled.required' => 'Kargo durumu zorunludur.',
            'is_shipping_enabled.boolean' => 'Kargo durumu geçersiz.',
        ];
    }
}
