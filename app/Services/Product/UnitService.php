<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
use App\Interfaces\Services\Product\UnitServiceInterface;
use App\Repositories\UnitRepository;
use App\Services\BaseService;

class UnitService extends BaseService implements UnitServiceInterface
{
    public function __construct(
        protected UnitRepository $repo
    ) {}

    /**
     * Get all units ordered by ID
     */
    public function list(): ServiceResponse
    {
        try {
            $units = $this->repo->all();
            
            return $this->successResponse($units, 'Birimler başarıyla getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Birimler alınamadı');
        }
    }
}
