<?php

namespace App\Http\Requests\Api\V1\PublicRequests;

use Illuminate\Foundation\Http\FormRequest;

class VoteReviewRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'is_helpful' => 'required|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'is_helpful.required' => 'Oy tercihiniz gereklidir.',
            'is_helpful.boolean' => 'Geçersiz oy değeri.',
        ];
    }
}
