<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Enums\ProductStatus;
use App\Interfaces\Services\Admin\AdminProductManagementServiceInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Services\BaseService;

class AdminProductManagementService extends BaseService implements AdminProductManagementServiceInterface
{
    public function __construct(
        protected ProductRepositoryInterface $productRepository
    ) {}

    public function list(array $filters, int $perPage): ServiceResponse
    {
        try {
            $products = $this->productRepository->getFilteredForAdmin($filters, $perPage);
            
            return $this->successResponse($products, 'Products listed');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürünler listelenemedi');
        }
    }

    public function find(string $id): ServiceResponse
    {
        try {
            $product = $this->productRepository->findWithAdminDetails($id);
            
            if (!$product) {
                return $this->errorResponse('Product not found', 404);
            }
            
            return $this->successResponse($product);
        } catch (\Exception $e) {
            return $this->errorResponse('Product not found', 404);
        }
    }

    public function updateStatus(string $id, string $status, ?string $rejectionReason, ?int $adminId): ServiceResponse
    {
        try {
            $product = $this->productRepository->findById($id);
            
            if (!$product) {
                return $this->errorResponse('Product not found', 404);
            }
            
            $statusEnum = ProductStatus::tryFrom($status);
            $updateData = ['status' => $status];
            
            if ($statusEnum?->requiresRejectionReason()) {
                $updateData['rejection_reason'] = $rejectionReason;
                $updateData['rejected_at'] = now();
                $updateData['rejected_by'] = $adminId;
            }
            
            if ($statusEnum?->clearsRejectionData() && $product->status === ProductStatus::REJECTED->value) {
                $updateData['rejection_reason'] = null;
                $updateData['rejected_at'] = null;
                $updateData['rejected_by'] = null;
            }
            
            $updatedProduct = $this->productRepository->updateStatus($id, $updateData);
            
            return $this->successResponse(
                $updatedProduct,
                ProductStatus::getChangeMessage($status)
            );
        } catch (\Exception $e) {
            return $this->handleException($e, 'Durum güncellenemedi');
        }
    }

    public function bulkUpdateStatus(array $productIds, string $status, ?string $rejectionReason, ?int $adminId): ServiceResponse
    {
        try {
            $statusEnum = ProductStatus::tryFrom($status);
            $updateData = ['status' => $status];
            
            if ($statusEnum?->requiresRejectionReason()) {
                $updateData['rejection_reason'] = $rejectionReason;
                $updateData['rejected_at'] = now();
                $updateData['rejected_by'] = $adminId;
            }
            
            if ($statusEnum?->clearsRejectionData()) {
                $updateData['rejection_reason'] = null;
                $updateData['rejected_at'] = null;
                $updateData['rejected_by'] = null;
            }
            
            $count = $this->productRepository->bulkUpdateWithData($productIds, $updateData);
            
            return $this->successResponse(['updated_count' => $count], "{$count} ürün güncellendi");
        } catch (\Exception $e) {
            return $this->handleException($e, 'Toplu güncelleme başarısız');
        }
    }

    public function delete(string $id): ServiceResponse
    {
        try {
            $product = $this->productRepository->findById($id);
            
            if (!$product) {
                return $this->errorResponse('Product not found', 404);
            }
            
            $this->productRepository->delete($id);
            
            return $this->successResponse(null, 'Ürün silindi', 204);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Ürün silinemedi');
        }
    }

    public function getStatistics(): ServiceResponse
    {
        try {
            $stats = $this->productRepository->getStatistics();
            
            return $this->successResponse($stats, 'Product statistics');
        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler alınamadı');
        }
    }
}
