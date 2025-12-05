<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Api\V1\Admin\StoreCategoryRequest;
use App\Http\Requests\Api\V1\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class CategoryController extends BaseAdminController
{
    use \App\Traits\ResponseHttp;

    /**
     * Tüm kategorileri listele
     */
    public function index(Request $request)
    {
        $query = Category::query()
            ->withCount(['children', 'directProducts'])
            ->with(['parent:id,name']);

        // Filtreleme
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('parent_id')) {
            if ($request->parent_id === 'root') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $request->parent_id);
            }
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        // Sıralama
        $sortField = $request->input('sort_field', 'sort_order');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortField, $sortOrder)->orderBy('name');

        // Sayfalama veya tümünü getir
        if ($request->filled('per_page')) {
            $categories = $query->paginate($request->per_page);
        } else {
            $categories = $query->get();
        }

        return $this->success($categories);
    }

    /**
     * Hiyerarşik ağaç yapısında kategorileri getir
     */
    public function tree()
    {
        $categories = Category::whereNull('parent_id')
            ->with(['children' => function ($q) {
                $q->with(['children' => function ($q2) {
                    $q2->withCount('directProducts')->orderBy('sort_order')->orderBy('name');
                }])
                ->withCount('directProducts')
                ->orderBy('sort_order')
                ->orderBy('name');
            }])
            ->withCount('directProducts')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return $this->success($categories);
    }

    /**
     * Yeni kategori oluştur
     */
    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->validated();

        // Slug oluştur
        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        
        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        $validated['slug'] = $slug;

        // Görsel yükle
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
            $validated['image'] = '/storage/' . $imagePath;
        }

        // Varsayılan değerler
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;

        $category = Category::create($validated);
        $category->load('parent:id,name');

        return $this->success($category, 'Kategori başarıyla oluşturuldu.', 201);
    }

    /**
     * Kategori detayı
     */
    public function show(Category $category)
    {
        $category->load(['parent:id,name', 'children:id,parent_id,name,slug,icon,is_active,sort_order'])
                 ->loadCount(['directProducts', 'children']);
        
        return $this->success($category);
    }

    /**
     * Kategori güncelle
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                // Kendisini veya alt kategorilerinden birini parent olarak seçemez
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
        ]);

        // Slug güncelle (isim değiştiyse)
        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;
            
            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        // Görsel yükle
        if ($request->hasFile('image')) {
            // Eski görseli sil
            if ($category->image) {
                $oldPath = str_replace('/storage/', '', $category->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            $imagePath = $request->file('image')->store('categories', 'public');
            $validated['image'] = '/storage/' . $imagePath;
        }

        $category->update($validated);
        $category->load('parent:id,name');

        return $this->success($category, 'Kategori başarıyla güncellendi.');
    }

    /**
     * Kategori sil
     */
    public function destroy(Category $category)
    {
        // Alt kategorileri kontrol et
        if ($category->children()->count() > 0) {
            return $this->error('Bu kategorinin alt kategorileri var. Önce alt kategorileri silmelisiniz.', 422);
        }

        // Ürün bağlantılarını kontrol et
        if ($category->directProducts()->count() > 0) {
            return $this->error('Bu kategoriye bağlı ürünler var. Önce ürünleri başka bir kategoriye taşıyın.', 422);
        }

        // Görseli sil
        if ($category->image) {
            $imagePath = str_replace('/storage/', '', $category->image);
            Storage::disk('public')->delete($imagePath);
        }

        $category->delete();

        return $this->success(null, 'Kategori başarıyla silindi.');
    }

    /**
     * Toplu durum güncelleme
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:categories,id',
            'is_active' => 'required|boolean',
        ]);

        Category::whereIn('id', $validated['ids'])
            ->update(['is_active' => $validated['is_active']]);

        return $this->success(null, 'Kategoriler başarıyla güncellendi.');
    }

    /**
     * Sıralama güncelleme
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['categories'] as $item) {
            Category::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return $this->success(null, 'Kategori sıralaması güncellendi.');
    }

    /**
     * İstatistikler
     */
    public function statistics()
    {
        $stats = [
            'total' => Category::count(),
            'active' => Category::where('is_active', true)->count(),
            'inactive' => Category::where('is_active', false)->count(),
            'root_categories' => Category::whereNull('parent_id')->count(),
            'sub_categories' => Category::whereNotNull('parent_id')->count(),
        ];

        return $this->success($stats);
    }

    /**
     * Tüm alt kategori ID'lerini recursive olarak getir
     */
    private function getAllChildIds(Category $category): array
    {
        $ids = [];
        foreach ($category->children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $this->getAllChildIds($child));
        }
        return $ids;
    }
}
