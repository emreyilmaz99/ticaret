<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vendorId = $this->user()->id;

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                'alpha_num',
                Rule::unique('vendor_coupons')->where(function ($query) use ($vendorId) {
                    return $query->where('vendor_id', $vendorId);
                }),
            ],
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'discount_amount' => 'required|numeric|min:1|max:99999.99',
            'min_order_amount' => 'nullable|numeric|min:0|max:99999.99',
            'usage_limit' => 'nullable|integer|min:1',
            'usage_limit_per_user' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kupon kodu gereklidir.',
            'code.unique' => 'Bu kupon kodu zaten kullanılıyor.',
            'code.alpha_num' => 'Kupon kodu sadece harf ve rakam içerebilir.',
            'code.max' => 'Kupon kodu en fazla 50 karakter olabilir.',
            'name.required' => 'Kupon adı gereklidir.',
            'name.max' => 'Kupon adı en fazla 255 karakter olabilir.',
            'description.max' => 'Açıklama en fazla 1000 karakter olabilir.',
            'discount_amount.required' => 'İndirim tutarı gereklidir.',
            'discount_amount.min' => 'İndirim tutarı en az 1₺ olmalıdır.',
            'discount_amount.max' => 'İndirim tutarı en fazla 99999.99₺ olabilir.',
            'min_order_amount.min' => 'Minimum sipariş tutarı negatif olamaz.',
            'min_order_amount.max' => 'Minimum sipariş tutarı en fazla 99999.99₺ olabilir.',
            'usage_limit.min' => 'Kullanım limiti en az 1 olmalıdır.',
            'usage_limit_per_user.min' => 'Kullanıcı başına kullanım limiti en az 1 olmalıdır.',
            'expires_at.after_or_equal' => 'Bitiş tarihi başlangıç tarihinden önce olamaz.',
        ];
    }
}
