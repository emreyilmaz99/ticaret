<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Repositories\VendorRepository;
use App\Services\BaseService;
use App\Services\Vendor\VendorService;

class AdminVendorService extends BaseService
{
    public function __construct(
        protected VendorRepository $repo,
        protected VendorService $vendorService
    ) {}

    // ==================== Core CRUD (Delegate to VendorService) ====================

    public function find(int $id)
    {
        return $this->vendorService->find($id);
    }

    public function create(array $data)
    {
        return $this->vendorService->create($data);
    }

    public function update(int $id, array $data): ServiceResponse
    {
        return $this->vendorService->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->vendorService->delete($id);
    }

    // ==================== Admin-Specific Operations ====================

    /**
     * Get vendors list for admin with stats
     */
    public function list(int $perPage = 15, ?string $status = null): ServiceResponse
    {
        try {
            $paginator = $this->repo->listForAdmin($perPage, $status);

            return $this->successResponse($paginator, 'Satıcılar listelendi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Satıcılar listelenemedi');
        }
    }

    /**
     * Get vendor statistics
     */
    public function getStatistics(): ServiceResponse
    {
        try {
            $stats = $this->repo->getStatistics();

            return $this->successResponse($stats, 'İstatistikler getirildi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'İstatistikler alınamadı');
        }
    }

    /**
     * Update vendor status
     */
    public function updateStatus(int $id, string $status): ServiceResponse
    {
        try {
            $vendor = $this->repo->find($id);

            if (!$vendor) {
                return $this->errorResponse('Satıcı bulunamadı', 404);
            }

            $vendor->update(['status' => $status]);

            return $this->successResponse($vendor, 'Durum güncellendi');

        } catch (\Exception $e) {
            return $this->handleException($e, 'Durum güncellenemedi');
        }
    }
}
