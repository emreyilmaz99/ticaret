<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Admin\AdminCategoryServiceInterface;
use App\Models\Category;
use App\Services\BaseService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCategoryService extends BaseService implements AdminCategoryServiceInterface
{
    public function list(array $filters): ServiceResponse
    {
        try {
            $query = Category::query()
                ->withCount(['children', 'directProducts'])
                ->with(['parent:id,name']);

            if (!empty($filters['search'])) {
                $search = $filters['search'];
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('slug', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            if (isset($filters['parent_id'])) {
                if ($filters['parent_id'] === 'root') {
                    $query->whereNull('parent_id');
                } else {
                    $query->where('parent_id', $filters['parent_id']);
                }
            }

            if (isset($filters['is_active'])) {
                $query->where('is_active', $filters['is_active'] === 'true' || $filters['is_active'] === '1');
            }

            $sortField = $filters['sort_field'] ?? 'sort_order';
            $sortOrder = $filters['sort_order'] ?? 'asc';
            $query->orderBy($sortField, $sortOrder)->orderBy('name');

            $categories = isset($filters['per_page']) ? $query->paginate($filters['per_page']) : $query->get();

            return $this->successResponse($categories);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategoriler getirilemedi');
        }
    }

    public function getTree(): ServiceResponse
    {
        try {
            $categories = Category::whereNull('parent_id')
                ->with(['children' => fn($q) => $q->with(['children' => fn($q2) => $q2->withCount('directProducts')->orderBy('sort_order')->orderBy('name')])
                    ->withCount('directProducts')->orderBy('sort_order')->orderBy('name')])
                ->withCount('directProducts')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get();

            return $this->successResponse($categories);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori ağacı alınamadı');
        }
    }

    public function create(array $data): ServiceResponse
    {
        try {
            $slug = Str::slug($data['name']);
            $originalSlug = $slug;
            $counter = 1;
            
            while (Category::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter++;
            }
            $data['slug'] = $slug;

            if (isset($data['image_file'])) {
                $imagePath = $data['image_file']->store('categories', 'public');
                $data['image'] = '/storage/' . $imagePath;
                unset($data['image_file']);
            }

            $data['sort_order'] = $data['sort_order'] ?? 0;
            $data['is_active'] = $data['is_active'] ?? true;

            $category = Category::create($data);
            $category->load('parent:id,name');

            return $this->successResponse($category, 'Kategori başarıyla oluşturuldu.', 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori oluşturulamadı');
        }
    }

    public function find(int $id): ServiceResponse
    {
        try {
            $category = Category::with(['parent:id,name', 'children:id,parent_id,name,slug,icon,is_active,sort_order'])
                ->withCount(['directProducts', 'children'])
                ->findOrFail($id);
            
            return $this->successResponse($category);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori bulunamadı');
        }
    }

    public function update(int $id, array $data): ServiceResponse
    {
        try {
            $category = Category::findOrFail($id);

            if (isset($data['name']) && $data['name'] !== $category->name) {
                $slug = Str::slug($data['name']);
                $originalSlug = $slug;
                $counter = 1;
                
                while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter++;
                }
                $data['slug'] = $slug;
            }

            if (isset($data['image_file'])) {
                if ($category->image) {
                    $oldPath = str_replace('/storage/', '', $category->image);
                    Storage::disk('public')->delete($oldPath);
                }
                
                $imagePath = $data['image_file']->store('categories', 'public');
                $data['image'] = '/storage/' . $imagePath;
                unset($data['image_file']);
            }

            $category->update($data);
            $category->load('parent:id,name');

            return $this->successResponse($category, 'Kategori başarıyla güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori güncellenemedi');
        }
    }

    public function delete(int $id): ServiceResponse
    {
        try {
            $category = Category::findOrFail($id);

            if ($category->children()->count() > 0) {
                return $this->errorResponse('Bu kategorinin alt kategorileri var. Önce alt kategorileri silmelisiniz.', 422);
            }

            if ($category->directProducts()->count() > 0) {
                return $this->errorResponse('Bu kategoriye bağlı ürünler var. Önce ürünleri başka bir kategoriye taşıyın.', 422);
            }

            if ($category->image) {
                $imagePath = str_replace('/storage/', '', $category->image);
                Storage::disk('public')->delete($imagePath);
            }

            $category->delete();

            return $this->successResponse(null, 'Kategori başarıyla silindi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori silinemedi');
        }
    }

    public function bulkUpdateStatus(array $ids, bool $isActive): ServiceResponse
    {
        try {
            Category::whereIn('id', $ids)->update(['is_active' => $isActive]);

            return $this->successResponse(null, 'Kategoriler başarıyla güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu güncelleme başarısız');
        }
    }

    public function updateOrder(array $categories): ServiceResponse
    {
        try {
            foreach ($categories as $item) {
                Category::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }

            return $this->successResponse(null, 'Kategori sıralaması güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sıralama güncellenemedi');
        }
    }

    public function getStatistics(): ServiceResponse
    {
        try {
            $stats = [
                'total' => Category::count(),
                'active' => Category::where('is_active', true)->count(),
                'inactive' => Category::where('is_active', false)->count(),
                'root_categories' => Category::whereNull('parent_id')->count(),
                'sub_categories' => Category::whereNotNull('parent_id')->count(),
            ];

            return $this->successResponse($stats);
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler alınamadı');
        }
    }
}
