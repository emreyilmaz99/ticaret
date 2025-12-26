<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Admin\AdminCategoryServiceInterface;
use App\Repositories\CategoryRepository;
use App\Services\BaseService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCategoryService extends BaseService implements AdminCategoryServiceInterface
{
    public function __construct(
        protected CategoryRepository $categoryRepository
    ) {}

    public function list(array $filters): ServiceResponse
    {
        try {
            $categories = $this->categoryRepository->getFiltered($filters);
            return $this->successResponse($categories);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategoriler getirilemedi');
        }
    }

    public function getTree(): ServiceResponse
    {
        try {
            $categories = $this->categoryRepository->getTree();
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
            
            while ($this->categoryRepository->existsBySlug($slug)) {
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

            $category = $this->categoryRepository->create($data);

            return $this->successResponse($category, 'Kategori başarıyla oluşturuldu.', 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori oluşturulamadı');
        }
    }

    public function find(int $id): ServiceResponse
    {
        try {
            $category = $this->categoryRepository->findWithDetails($id);
            
            if (!$category) {
                return $this->errorResponse('Kategori bulunamadı', 404);
            }
            
            return $this->successResponse($category);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori bulunamadı');
        }
    }

    public function update(int $id, array $data): ServiceResponse
    {
        try {
            $category = $this->categoryRepository->findById($id);
            
            if (!$category) {
                return $this->errorResponse('Kategori bulunamadı', 404);
            }

            if (isset($data['name']) && $data['name'] !== $category->name) {
                $slug = Str::slug($data['name']);
                $originalSlug = $slug;
                $counter = 1;
                
                while ($this->categoryRepository->existsBySlugExcept($slug, $category->id)) {
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

            $updatedCategory = $this->categoryRepository->update($id, $data);

            return $this->successResponse($updatedCategory, 'Kategori başarıyla güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori güncellenemedi');
        }
    }

    public function delete(int $id): ServiceResponse
    {
        try {
            // Check if category exists
            $category = $this->categoryRepository->findById($id);
            
            if (!$category) {
                return $this->errorResponse('Kategori bulunamadı', 404);
            }

            // Check for children
            if ($this->categoryRepository->hasChildren($id)) {
                return $this->errorResponse('Bu kategorinin alt kategorileri var. Önce alt kategorileri silmelisiniz.', 422);
            }

            // Check for products
            if ($this->categoryRepository->hasProducts($id)) {
                return $this->errorResponse('Bu kategoriye bağlı ürünler var. Önce ürünleri başka bir kategoriye taşıyın.', 422);
            }

            // Delete image if exists
            if ($category->image) {
                $imagePath = str_replace('/storage/', '', $category->image);
                Storage::disk('public')->delete($imagePath);
            }

            $this->categoryRepository->delete($id);

            return $this->successResponse(null, 'Kategori başarıyla silindi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Kategori silinemedi');
        }
    }

    public function bulkUpdateStatus(array $ids, bool $isActive): ServiceResponse
    {
        try {
            $this->categoryRepository->bulkUpdateStatus($ids, $isActive);
            return $this->successResponse(null, 'Kategoriler başarıyla güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu güncelleme başarısız');
        }
    }

    public function updateOrder(array $categories): ServiceResponse
    {
        try {
            $this->categoryRepository->updateSortOrders($categories);
            return $this->successResponse(null, 'Kategori sıralaması güncellendi.');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Sıralama güncellenemedi');
        }
    }

    public function getStatistics(): ServiceResponse
    {
        try {
            $stats = $this->categoryRepository->getStatistics();
            return $this->successResponse($stats);
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler alınamadı');
        }
    }
}