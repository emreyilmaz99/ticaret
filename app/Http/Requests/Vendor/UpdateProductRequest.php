<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes','required','string','max:255'],
            'slug' => ['sometimes','nullable','string','max:255'],
            'short_description' => ['nullable','string'],
            'description' => ['nullable','string'],
            'type' => ['sometimes','required','in:simple,variable,bundle'],
            'price' => ['nullable','numeric','min:0'],
            'sku' => ['nullable','string','max:100'],
            'is_featured' => ['nullable','boolean'],
        ];
    }
}
