<?php

namespace App\Http\Requests\Api\V1\PublicRequests;

use Illuminate\Foundation\Http\FormRequest;

class SearchProductsRequest extends FormRequest
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
            'q' => 'nullable|string|min:2|max:200',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'q.min' => 'Arama terimi en az 2 karakter olmalıdır.',
            'q.max' => 'Arama terimi en fazla 200 karakter olabilir.',
        ];
    }
}
