<?php

namespace App\Http\Requests\Api\V1\Admin;

use App\Models\Category;

class UpdateCategoryRequest extends BaseAdminRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name' => 'sometimes|required|string|max:255',
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($category) {
                    if ($value == $category->id) {
                        $fail('Kategori kendisini üst kategori olarak seçemez.');
                    }
                    // Alt kategorilerini de kontrol et
                    $childIds = $this->getAllChildIds($category);
                    if (in_array($value, $childIds)) {
                        $fail('Kategori kendi alt kategorisini üst kategori olarak seçemez.');
                    }
                }
            ],
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'settings' => 'nullable|array',
        ];
    }

    /**
     * Get all child category IDs recursively.
     */
    protected function getAllChildIds(Category $category): array
    {
        $ids = [];
        foreach ($category->children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $this->getAllChildIds($child));
        }
        return $ids;
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
