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
            // Bank account fields
            'bank_name' => 'required|string|max:100',
            'account_holder' => 'required|string|max:255',
            'iban' => 'required|string|max:34',
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Ad soyad gereklidir',
            'company_name.required' => 'Şirket adı gereklidir',
            'slug.required' => 'Mağaza URL\'si gereklidir',
            'slug.regex' => 'URL sadece küçük harf, rakam ve tire içerebilir',
            'phone.required' => 'Telefon numarası gereklidir',
            'address_line.required' => 'Adres gereklidir',
            'city.required' => 'Şehir gereklidir',
            'country.required' => 'Ülke gereklidir',
            'bank_name.required' => 'Banka adı gereklidir',
            'account_holder.required' => 'Hesap sahibi adı gereklidir',
            'iban.required' => 'IBAN gereklidir',
        ];
    }
}
