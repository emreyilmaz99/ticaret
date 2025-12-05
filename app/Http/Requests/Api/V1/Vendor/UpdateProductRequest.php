<?php

namespace App\Http\Requests\Api\V1\Vendor;

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
            'type' => ['sometimes','required','in:simple,variable'],
            'price' => ['nullable','numeric','min:0'],
            'stock' => ['nullable','integer','min:0'],
            'sku' => ['nullable','string','max:100'],
            'is_featured' => ['nullable','boolean'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'unit_id' => ['nullable','exists:units,id'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'tags' => ['nullable', 'array'],
            'variants' => ['nullable', 'array'],
        ];
    }
}
