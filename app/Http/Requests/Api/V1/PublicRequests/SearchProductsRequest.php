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
            'category_id' => 'nullable|integer|exists:categories,id',
            'vendor_id' => 'nullable|integer|exists:vendors,id',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:min_price',
            'in_stock' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'sort_by' => 'nullable|string|in:relevance,price,created_at,name',
            'sort_direction' => 'nullable|string|in:asc,desc',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'highlight' => 'nullable|boolean',
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
            'max_price.gte' => 'Maksimum fiyat minimum fiyattan küçük olamaz.',
            'per_page.max' => 'Sayfa başına maksimum 100 ürün gösterilebilir.',
        ];
    }

    /**
     * Convert request to filters array for service
     */
    public function toFilters(): array
    {
        return [
            'q' => $this->input('q', ''),
            'category_id' => $this->input('category_id'),
            'vendor_id' => $this->input('vendor_id'),
            'min_price' => $this->input('min_price'),
            'max_price' => $this->input('max_price'),
            'in_stock' => $this->boolean('in_stock'),
            'is_featured' => $this->boolean('is_featured'),
            'sort_by' => $this->input('sort_by', 'relevance'),
            'sort_direction' => $this->input('sort_direction', 'asc'),
            'page' => $this->input('page', 1),
            'per_page' => $this->input('per_page', 10),
            'highlight' => $this->boolean('highlight'),
        ];
    }
}
