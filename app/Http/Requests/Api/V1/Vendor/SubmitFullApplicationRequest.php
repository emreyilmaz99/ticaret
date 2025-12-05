<?php

namespace App\Http\Requests\Api\V1\Vendor;

use App\Models\VendorApplication;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitFullApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public endpoint
    }

    public function rules(): array
    {
        $merchantType = $this->input('merchant_type');

        $rules = [
            // Temel bilgiler
            'full_name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|regex:/^[a-z0-9-]+$/',
            'phone' => 'required|string|max:20',
            
            // iyzico SubMerchant türü - zorunlu
            'merchant_type' => [
                'required',
                Rule::in(VendorApplication::merchantTypes()),
            ],
            
            // Adres bilgileri (iyzico için zorunlu)
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'district' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            
            // Banka bilgileri
            'bank_name' => 'required|string|max:100',
            'account_holder' => 'required|string|max:255',
            'iban' => ['required', 'string', 'size:26', 'regex:/^TR[0-9]{24}$/'],
        ];

        // Satıcı türüne göre koşullu validasyonlar
        if ($merchantType === VendorApplication::MERCHANT_TYPE_PERSONAL) {
            // Bireysel satıcı için TC Kimlik ve iletişim kişisi zorunlu
            $rules['identity_number'] = ['required', 'string', 'size:11', 'regex:/^[0-9]{11}$/'];
            $rules['contact_name'] = 'required|string|max:100';
            $rules['contact_surname'] = 'required|string|max:100';
            $rules['tax_id'] = 'nullable|string|max:50';
            $rules['tax_office'] = 'nullable|string|max:100';
            $rules['legal_company_title'] = 'nullable|string|max:255';
        } elseif ($merchantType === VendorApplication::MERCHANT_TYPE_PRIVATE_COMPANY) {
            // Şahıs şirketi için TC Kimlik, vergi dairesi ve şirket ünvanı zorunlu
            $rules['identity_number'] = ['required', 'string', 'size:11', 'regex:/^[0-9]{11}$/'];
            $rules['tax_office'] = 'required|string|max:100';
            $rules['legal_company_title'] = 'required|string|max:255';
            $rules['tax_id'] = 'nullable|string|max:50';
            $rules['contact_name'] = 'nullable|string|max:100';
            $rules['contact_surname'] = 'nullable|string|max:100';
        } elseif ($merchantType === VendorApplication::MERCHANT_TYPE_LIMITED_COMPANY) {
            // Limited/Anonim şirket için vergi no, vergi dairesi ve şirket ünvanı zorunlu
            $rules['tax_id'] = ['required', 'string', 'size:10', 'regex:/^[0-9]{10}$/'];
            $rules['tax_office'] = 'required|string|max:100';
            $rules['legal_company_title'] = 'required|string|max:255';
            $rules['identity_number'] = 'nullable|string|max:11';
            $rules['contact_name'] = 'nullable|string|max:100';
            $rules['contact_surname'] = 'nullable|string|max:100';
        } else {
            // merchant_type henüz belirlenmemişse tüm alanlar nullable
            $rules['identity_number'] = 'nullable|string|max:11';
            $rules['contact_name'] = 'nullable|string|max:100';
            $rules['contact_surname'] = 'nullable|string|max:100';
            $rules['tax_id'] = 'nullable|string|max:50';
            $rules['tax_office'] = 'nullable|string|max:100';
            $rules['legal_company_title'] = 'nullable|string|max:255';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            // Temel alanlar
            'full_name.required' => 'Ad soyad gereklidir',
            'company_name.required' => 'Şirket/Mağaza adı gereklidir',
            'slug.required' => 'Mağaza URL\'si gereklidir',
            'slug.regex' => 'URL sadece küçük harf, rakam ve tire içerebilir',
            'phone.required' => 'Telefon numarası gereklidir',
            
            // Satıcı türü
            'merchant_type.required' => 'Satıcı türü seçilmelidir',
            'merchant_type.in' => 'Geçersiz satıcı türü',
            
            // Adres
            'address.required' => 'Adres gereklidir',
            'city.required' => 'Şehir gereklidir',
            
            // Banka
            'bank_name.required' => 'Banka adı gereklidir',
            'account_holder.required' => 'Hesap sahibi adı gereklidir',
            'iban.required' => 'IBAN gereklidir',
            'iban.size' => 'IBAN 26 karakter olmalıdır',
            'iban.regex' => 'Geçerli bir Türkiye IBAN\'ı giriniz (TR ile başlamalı)',
            
            // TC Kimlik
            'identity_number.required' => 'TC Kimlik numarası gereklidir',
            'identity_number.size' => 'TC Kimlik numarası 11 hane olmalıdır',
            'identity_number.regex' => 'Geçerli bir TC Kimlik numarası giriniz',
            
            // İletişim kişisi
            'contact_name.required' => 'İletişim kişisi adı gereklidir',
            'contact_surname.required' => 'İletişim kişisi soyadı gereklidir',
            
            // Vergi bilgileri
            'tax_id.required' => 'Vergi numarası gereklidir',
            'tax_id.size' => 'Vergi numarası 10 hane olmalıdır',
            'tax_id.regex' => 'Geçerli bir vergi numarası giriniz',
            'tax_office.required' => 'Vergi dairesi gereklidir',
            'legal_company_title.required' => 'Yasal şirket ünvanı gereklidir',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Slug'ı temizle (küçük harf, sadece alfanumerik ve tire)
        if ($this->has('slug')) {
            $slug = $this->slug;
            $slug = mb_strtolower($slug, 'UTF-8'); // Küçük harfe çevir
            $slug = preg_replace('/[^a-z0-9-]/', '-', $slug); // Geçersiz karakterleri tire yap
            $slug = preg_replace('/-+/', '-', $slug); // Ardışık tireleri tek tireye indir
            $slug = trim($slug, '-'); // Baş ve sondaki tireleri kaldır
            $this->merge(['slug' => $slug]);
        }

        // IBAN'ı temizle (boşlukları kaldır, büyük harfe çevir)
        if ($this->has('iban')) {
            $this->merge([
                'iban' => strtoupper(str_replace(' ', '', $this->iban)),
            ]);
        }

        // TC Kimlik'ten boşlukları kaldır
        if ($this->has('identity_number')) {
            $this->merge([
                'identity_number' => str_replace(' ', '', $this->identity_number),
            ]);
        }

        // Vergi numarasından boşlukları kaldır
        if ($this->has('tax_id')) {
            $this->merge([
                'tax_id' => str_replace(' ', '', $this->tax_id),
            ]);
        }
    }
}
