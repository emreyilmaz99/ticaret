<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAvatarRequest extends FormRequest
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
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
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
            'avatar.required' => 'Profil fotoğrafı zorunludur.',
            'avatar.image' => 'Dosya bir resim olmalıdır.',
            'avatar.mimes' => 'Sadece jpeg, png, jpg ve webp formatları desteklenir.',
            'avatar.max' => 'Dosya boyutu en fazla 2MB olabilir.',
        ];
    }
}
