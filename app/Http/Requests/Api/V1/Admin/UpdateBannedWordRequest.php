<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Validation\Rule;

class UpdateBannedWordRequest extends BaseAdminRequest
{
    public function rules(): array
    {
        $bannedWordId = $this->route('bannedWord') ?? $this->route('id');
        
        return [
            'word' => [
                'required',
                'string',
                'max:100',
                Rule::unique('banned_words', 'word')->ignore($bannedWordId),
            ],
            'is_regex' => 'boolean',
            'pattern' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'word.required' => 'Yasaklı kelime zorunludur.',
            'word.unique' => 'Bu kelime zaten yasaklı listesinde.',
            'word.max' => 'Kelime en fazla 100 karakter olabilir.',
        ];
    }
}
