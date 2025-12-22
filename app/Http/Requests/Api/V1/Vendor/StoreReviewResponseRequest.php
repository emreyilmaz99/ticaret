<?php

namespace App\Http\Requests\Api\V1\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewResponseRequest extends FormRequest
{
    /**
     * Prepare data for validation
     * Accept both 'response' and 'response_text' field names
     */
    protected function prepareForValidation(): void
    {
        // Support both field names for frontend compatibility
        if ($this->has('response') && !$this->has('response_text')) {
            $this->merge([
                'response_text' => $this->input('response')
            ]);
        }
    }

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
            'response_text' => ['required', 'string', 'min:10', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'response_text.required' => 'Yanıt metni gereklidir',
            'response_text.min' => 'Yanıt en az 10 karakter olmalıdır',
            'response_text.max' => 'Yanıt en fazla 500 karakter olmalıdır',
        ];
    }
}
