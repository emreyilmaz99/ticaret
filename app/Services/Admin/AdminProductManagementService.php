<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Http\Resources\Api\V1\Shared\ProductResource;
use App\Interfaces\Services\Admin\AdminProductManagementServiceInterface;
use App\Models\Product;
use App\Services\BaseService;

class AdminProductManagementService extends BaseService implements AdminProductManagementServiceInterface
{
    public function list(array $filters, int $perPage): ServiceResponse
    {
        try {
            $query = Product::with(['vendor', 'category', 'photos', 'variants', 'tags']);
            
            if (isset($filters['status']) && $filters['status'] !== 'all') {
                $query->where('status', $filters['status']);
            }
            
            if (isset($filters['vendor_id']) && $filters['vendor_id']) {
                $query->where('vendor_id', $filters['vendor_id']);
            }
            
            if (isset($filters['search']) && $filters['search']) {
                $search = $filters['search'];
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });
            }
            
            $sortField = $filters['sort_by'] ?? 'created_at';
            $sortDirection = $filters['sort_direction'] ?? 'desc';
            $query->orderBy($sortField, $sortDirection);
            
            $products = $query->paginate($perPage);
            
            return $this->successResponse(ProductResource::collection($products), 'Products listed');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürünler listelenemedi');
        }
    }

    public function find(int $id): ServiceResponse
    {
        try {
            $product = Product::with(['vendor', 'category', 'photos', 'variants', 'tags'])->findOrFail($id);
            
            return $this->successResponse(new ProductResource($product));
        } catch (\Exception $e) {
            return $this->errorResponse('Product not found', 404);
        }
    }

    public function updateStatus(int $id, string $status, ?string $rejectionReason, ?int $adminId): ServiceResponse
    {
        try {
            $product = Product::findOrFail($id);
            
            $oldStatus = $product->status;
            $product->status = $status;
            
            if ($status === 'rejected') {
                $product->rejection_reason = $rejectionReason;
                $product->rejected_at = now();
                $product->rejected_by = $adminId;
            }
            
            if ($status === 'active' && $oldStatus === 'rejected') {
                $product->rejection_reason = null;
                $product->rejected_at = null;
                $product->rejected_by = null;
            }
            
            $product->save();
            
            $statusMessages = [
                'pending' => 'Ürün onay bekliyor durumuna alındı',
                'active' => 'Ürün yayına alındı',
                'rejected' => 'Ürün reddedildi',
                'draft' => 'Ürün taslak durumuna alındı',
                'inactive' => 'Ürün pasife alındı',
                'banned' => 'Ürün yasaklandı'
            ];
            
            return $this->successResponse(
                new ProductResource($product->fresh(['vendor', 'category', 'photos', 'variants', 'tags'])),
                $statusMessages[$status] ?? 'Status updated'
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Durum güncellenemedi');
        }
    }

    public function bulkUpdateStatus(array $productIds, string $status, ?string $rejectionReason, ?int $adminId): ServiceResponse
    {
        try {
            $updateData = ['status' => $status];
            
            if ($status === 'rejected') {
                $updateData['rejection_reason'] = $rejectionReason;
                $updateData['rejected_at'] = now();
                $updateData['rejected_by'] = $adminId;
            }
            
            if ($status === 'active') {
                $updateData['rejection_reason'] = null;
                $updateData['rejected_at'] = null;
                $updateData['rejected_by'] = null;
            }
            
            $count = Product::whereIn('id', $productIds)->update($updateData);
            
            return $this->successResponse(['updated_count' => $count], "{$count} ürün güncellendi");
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu güncelleme başarısız');
        }
    }

    public function delete(int $id): ServiceResponse
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();
            
            return $this->successResponse(null, 'Ürün silindi', 204);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürün silinemedi');
        }
    }

    public function getStatistics(): ServiceResponse
    {
        try {
            $stats = [
                'total' => Product::count(),
                'pending' => Product::where('status', 'pending')->count(),
                'active' => Product::where('status', 'active')->count(),
                'rejected' => Product::where('status', 'rejected')->count(),
                'draft' => Product::where('status', 'draft')->count(),
                'inactive' => Product::where('status', 'inactive')->count(),
                'banned' => Product::where('status', 'banned')->count(),
            ];
            
            return $this->successResponse($stats, 'Product statistics');
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler alınamadı');
        }
    }
}
