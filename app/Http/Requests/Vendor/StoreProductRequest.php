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
            'name' => ['required','string','min:2','max:255'],
            'slug' => ['nullable','string','max:255'],
            'short_description' => ['nullable','string'],
            'description' => ['nullable','string'],
            'type' => ['required','in:simple,variable'],
            'price' => ['required_if:type,simple','nullable','numeric','min:0.01'],
            'stock' => ['required_if:type,simple','nullable','integer','min:0'],
            'sku' => ['nullable','string','max:100'],
            'is_featured' => ['nullable','boolean'],
            'category_id' => ['required','exists:categories,id'],
            'unit_id' => ['nullable','exists:units,id'],
            // extra fields for extended product creation
            'tags' => ['nullable','array'],
            'tags.*' => ['string'],
            'variants' => ['required_if:type,variable','nullable','array','min:1'],
            'variants.*.title' => ['required_with:variants','string'],
            'variants.*.sku' => ['nullable','string'],
            'variants.*.price' => ['required_with:variants','numeric','min:0.01'],
            'variants.*.stock' => ['required_with:variants','integer','min:0'],
            'variants.*.unit_id' => ['nullable','exists:units,id'],
            'images' => ['nullable'],
            'images.*' => ['image','mimes:jpeg,png,jpg,webp','max:5120'], // 5MB
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Ürün adı zorunludur',
            'name.min' => 'Ürün adı en az 2 karakter olmalıdır',
            'category_id.required' => 'Kategori seçimi zorunludur',
            'category_id.exists' => 'Geçersiz kategori',
            'price.required_if' => 'Basit ürünler için fiyat zorunludur',
            'price.min' => 'Fiyat 0\'dan büyük olmalıdır',
            'stock.required_if' => 'Basit ürünler için stok zorunludur',
            'stock.min' => 'Stok 0 veya daha fazla olmalıdır',
            'variants.required_if' => 'Varyantlı ürünler için en az bir varyant zorunludur',
            'variants.min' => 'En az bir varyant eklemelisiniz',
            'variants.*.title.required_with' => 'Varyant adı zorunludur',
            'variants.*.price.required_with' => 'Varyant fiyatı zorunludur',
            'variants.*.stock.required_with' => 'Varyant stoku zorunludur',
            'images.*.max' => 'Her görsel en fazla 5MB olabilir',
            'images.*.mimes' => 'Görseller sadece JPEG, PNG, JPG veya WEBP formatında olabilir',
        ];
    }
}
