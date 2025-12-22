<?php

namespace App\Services\Admin;

use App\Core\ServiceResponse;
use App\Repositories\VendorRepository;
use App\Services\BaseService;

class AdminVendorService extends BaseService
{
    public function __construct(
        protected VendorRepository $repo
    ) {}

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
