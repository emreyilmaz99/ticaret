<?php

namespace App\Http\Requests\Api\V1\PublicRequests;

use Illuminate\Foundation\Http\FormRequest;

class StorePreApplicationRequest extends FormRequest
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
            'email' => 'required|email|max:255',
            'full_name' => 'required|string|max:255',
            'company_name' => 'required|string|min:2|max:255',
            'phone' => 'required|string|min:10|max:20',
            'tax_id' => 'nullable|string|max:50',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email adresi zorunludur',
            'email.email' => 'Geçerli bir email adresi giriniz',
            'full_name.required' => 'Ad soyad zorunludur',
            'company_name.required' => 'Mağaza/Şirket adı zorunludur',
            'company_name.min' => 'Mağaza/Şirket adı en az 2 karakter olmalıdır',
            'phone.required' => 'Telefon numarası zorunludur',
            'phone.min' => 'Geçerli bir telefon numarası giriniz',
            'password.required' => 'Şifre zorunludur',
            'password.min' => 'Şifre en az 8 karakter olmalıdır',
            'password.confirmed' => 'Şifreler eşleşmiyor',
        ];
    }
}
