<?php

namespace App\Http\Requests\Api\V1\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
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
            'rating' => ['required', 'integer', 'between:1,5'],
            'title' => ['required', 'string', 'min:3', 'max:100'],
            'comment' => ['required', 'string', 'min:10', 'max:1000'],
            'is_anonymous' => ['boolean'],
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => ['image', 'mimes:jpeg,png,jpg', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'rating.required' => 'Puan vermeniz gerekiyor',
            'rating.between' => 'Puan 1 ile 5 arasında olmalıdır',
            'title.required' => 'Başlık gereklidir',
            'title.min' => 'Başlık en az 3 karakter olmalıdır',
            'title.max' => 'Başlık en fazla 100 karakter olmalıdır',
            'comment.required' => 'Yorum metni gereklidir',
            'comment.min' => 'Yorum en az 10 karakter olmalıdır',
            'comment.max' => 'Yorum en fazla 1000 karakter olmalıdır',
            'photos.max' => 'En fazla 5 fotoğraf yükleyebilirsiniz',
            'photos.*.image' => 'Sadece resim dosyaları yükleyebilirsiniz',
            'photos.*.max' => 'Her fotoğraf en fazla 5MB olabilir',
        ];
    }
}
