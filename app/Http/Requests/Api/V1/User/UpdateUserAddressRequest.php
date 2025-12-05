<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if the address belongs to the authenticated user
        $address = $this->route('address');
        return $address && $address->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'label' => ['sometimes', 'required', 'string', 'max:50'],
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'required', 'string', 'max:20'],
            'country' => ['sometimes', 'string', 'max:100'],
            'city' => ['sometimes', 'required', 'string', 'max:100'],
            'district' => ['sometimes', 'required', 'string', 'max:100'],
            'neighborhood' => ['sometimes', 'required', 'string', 'max:255'],
            'address_line' => ['sometimes', 'required', 'string'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'label.required' => 'Adres etiketi zorunludur.',
            'full_name.required' => 'Ad soyad zorunludur.',
            'phone.required' => 'Telefon numarası zorunludur.',
            'city.required' => 'Şehir zorunludur.',
            'district.required' => 'İlçe zorunludur.',
            'neighborhood.required' => 'Mahalle zorunludur.',
            'address_line.required' => 'Adres detayı zorunludur.',
        ];
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        throw new \Illuminate\Auth\Access\AuthorizationException('Bu adrese erişim yetkiniz yok.');
    }
}
