<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required','string','max:255'],
            'slug' => ['nullable','string','max:255'],
            'short_description' => ['nullable','string'],
            'description' => ['nullable','string'],
            'type' => ['required','in:simple,variable'],
            'price' => ['nullable','numeric','min:0'],
            'stock' => ['nullable','integer','min:0'],
            'sku' => ['nullable','string','max:100'],
            'is_featured' => ['nullable','boolean'],
            'category_id' => ['nullable','exists:categories,id'],
            'unit_id' => ['nullable','exists:units,id'],
            // extra fields for extended product creation
            'tags' => ['nullable','array'],
            'tags.*' => ['string'],
            'variants' => ['nullable','array'],
            'variants.*.title' => ['nullable','string'],
            'variants.*.sku' => ['nullable','string'],
            'variants.*.price' => ['nullable','numeric'],
            'variants.*.stock' => ['nullable','integer'],
            'variants.*.unit_id' => ['nullable','exists:units,id'],
            'images' => ['nullable'],
        ];
    }
}
