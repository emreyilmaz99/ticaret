<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ResponseHttp;

    /**
     * Tüm aktif kategorileri listele (public)
     */
    public function index(Request $request)
    {
        $query = Category::query()
            ->where('is_active', true)
            ->select(['id', 'parent_id', 'name', 'slug', 'icon', 'image', 'description']);

        // Sadece ana kategoriler
        if ($request->filled('root_only') && ($request->root_only === 'true' || $request->root_only == '1')) {
            $query->whereNull('parent_id');
        }

        // Belirli bir parent'ın alt kategorileri
        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }

        $categories = $query->orderBy('sort_order')->orderBy('name')->get();

        return $this->success($categories);
    }

    /**
     * Hiyerarşik ağaç yapısında aktif kategorileri getir (public)
     */
    public function tree()
    {
        $categories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->with(['activeChildren' => function ($q) {
                $q->with(['activeChildren' => function ($q2) {
                    $q2->select(['id', 'parent_id', 'name', 'slug', 'icon', 'image'])
                       ->orderBy('sort_order')
                       ->orderBy('name');
                }])
                ->select(['id', 'parent_id', 'name', 'slug', 'icon', 'image'])
                ->orderBy('sort_order')
                ->orderBy('name');
            }])
            ->select(['id', 'parent_id', 'name', 'slug', 'icon', 'image', 'description'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return $this->success($categories);
    }

    /**
     * Kategori detayı (public)
     */
    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with(['activeChildren:id,parent_id,name,slug,icon,image', 'parent:id,name,slug'])
            ->first();

        if (!$category) {
            return $this->error('Kategori bulunamadı.', 404);
        }

        return $this->success($category);
    }
}
