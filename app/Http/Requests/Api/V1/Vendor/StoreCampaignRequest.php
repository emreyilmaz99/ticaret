<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'buy_quantity' => 'required|integer|min:2|max:100',
            'pay_quantity' => 'required|integer|min:1|lt:buy_quantity',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'required|string',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Kampanya adı gereklidir.',
            'name.max' => 'Kampanya adı en fazla 255 karakter olabilir.',
            'description.max' => 'Açıklama en fazla 1000 karakter olabilir.',
            'buy_quantity.required' => 'Alınacak ürün adedi gereklidir.',
            'buy_quantity.min' => 'Alınacak ürün adedi en az 2 olmalıdır.',
            'buy_quantity.max' => 'Alınacak ürün adedi en fazla 100 olabilir.',
            'pay_quantity.required' => 'Ödenecek ürün adedi gereklidir.',
            'pay_quantity.min' => 'Ödenecek ürün adedi en az 1 olmalıdır.',
            'pay_quantity.lt' => 'Ödenecek adet, alınacak adetten az olmalıdır.',
            'starts_at.required' => 'Başlangıç tarihi gereklidir.',
            'starts_at.date' => 'Geçerli bir başlangıç tarihi giriniz.',
            'ends_at.required' => 'Bitiş tarihi gereklidir.',
            'ends_at.date' => 'Geçerli bir bitiş tarihi giriniz.',
            'ends_at.after' => 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.',
            'product_ids.required' => 'En az bir ürün seçmelisiniz.',
            'product_ids.min' => 'En az bir ürün seçmelisiniz.',
            'product_ids.array' => 'Ürün listesi geçerli bir dizi olmalıdır.',
        ];
    }
}
