<?php

namespace App\Http\Requests\Api\V1\PublicRequests;

use Illuminate\Foundation\Http\FormRequest;

class FilterVendorProductsRequest extends FormRequest
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
            'category' => 'nullable|exists:categories,id',
            'search' => 'nullable|string|max:200',
            'has_discount' => 'nullable|boolean',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:min_price',
            'sort' => 'nullable|in:newest,price_asc,price_desc,name_asc,name_desc,popular',
            'per_page' => 'nullable|integer|min:1|max:100',
            
            // VendorController için ek parametreler
            'category_id' => 'nullable|exists:categories,id',
            'filter' => 'nullable|in:high_rated,free_shipping,fast_delivery,discounted',
            'sort_by' => 'nullable|in:newest,price_asc,price_desc,rating,best_seller',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'category.exists' => 'Seçilen kategori bulunamadı.',
            'category_id.exists' => 'Seçilen kategori bulunamadı.',
            'max_price.gte' => 'Maksimum fiyat, minimum fiyattan küçük olamaz.',
            'per_page.max' => 'Sayfa başına en fazla 100 ürün gösterilebilir.',
        ];
    }
}
