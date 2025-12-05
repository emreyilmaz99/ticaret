<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'settings' => 'nullable|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Kategori adı zorunludur.',
            'name.max' => 'Kategori adı en fazla 255 karakter olabilir.',
            'parent_id.exists' => 'Seçilen üst kategori bulunamadı.',
            'description.max' => 'Açıklama en fazla 1000 karakter olabilir.',
            'image.image' => 'Dosya bir resim olmalıdır.',
            'image.mimes' => 'Sadece jpeg, png, jpg ve webp formatları desteklenir.',
            'image.max' => 'Dosya boyutu en fazla 2MB olabilir.',
            'sort_order.integer' => 'Sıralama sayı olmalıdır.',
            'sort_order.min' => 'Sıralama 0\'dan küçük olamaz.',
        ];
    }
}
