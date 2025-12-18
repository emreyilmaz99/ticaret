<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'buy_quantity' => 'sometimes|required|integer|min:2|max:100',
            'pay_quantity' => 'sometimes|required|integer|min:1',
            'starts_at' => 'sometimes|required|date',
            'ends_at' => 'sometimes|required|date|after:starts_at',
            'product_ids' => 'sometimes|required|array|min:1',
            'product_ids.*' => 'required|string',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Kampanya adı en fazla 255 karakter olabilir.',
            'description.max' => 'Açıklama en fazla 1000 karakter olabilir.',
            'buy_quantity.min' => 'Alınacak ürün adedi en az 2 olmalıdır.',
            'buy_quantity.max' => 'Alınacak ürün adedi en fazla 100 olabilir.',
            'pay_quantity.min' => 'Ödenecek ürün adedi en az 1 olmalıdır.',
            'starts_at.date' => 'Geçerli bir başlangıç tarihi giriniz.',
            'ends_at.date' => 'Geçerli bir bitiş tarihi giriniz.',
            'ends_at.after' => 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.',
            'product_ids.min' => 'En az bir ürün seçmelisiniz.',
            'product_ids.array' => 'Ürün listesi geçerli bir dizi olmalıdır.',
        ];
    }
}
