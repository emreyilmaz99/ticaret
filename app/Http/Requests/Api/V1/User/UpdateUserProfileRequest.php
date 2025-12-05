<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserProfileRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'identity_number' => ['nullable', 'string', 'size:11', 'regex:/^[0-9]+$/'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
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
            'name.required' => 'İsim zorunludur.',
            'name.max' => 'İsim en fazla 255 karakter olabilir.',
            'identity_number.size' => 'TC Kimlik numarası 11 haneli olmalıdır.',
            'identity_number.regex' => 'TC Kimlik numarası sadece rakamlardan oluşmalıdır.',
            'birth_date.date' => 'Geçerli bir tarih giriniz.',
            'birth_date.before' => 'Doğum tarihi bugünden önce olmalıdır.',
            'gender.in' => 'Geçersiz cinsiyet değeri.',
        ];
    }
}
