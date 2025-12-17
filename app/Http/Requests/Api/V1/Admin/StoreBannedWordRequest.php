<?php

namespace App\Http\Requests\Api\V1\Admin;

class StoreBannedWordRequest extends BaseAdminRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'word' => ['required', 'string', 'max:255', 'unique:banned_words,word'],
            'is_regex' => ['boolean'],
            'pattern' => ['nullable', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'word.required' => 'Kelime alanı zorunludur.',
            'word.unique' => 'Bu kelime zaten yasaklı listede mevcut.',
            'word.max' => 'Kelime en fazla 255 karakter olabilir.',
        ];
    }
}
