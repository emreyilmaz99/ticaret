<?php

namespace App\Services\Product;

use App\Core\ServiceResponse;
use App\Models\Unit;
use App\Services\BaseService;

class UnitService extends BaseService
{
    /**
     * Get all units ordered by ID
     */
    public function list(): ServiceResponse
    {
        try {
            $units = Unit::orderBy('id')->get();
            
            return $this->successResponse($units, 'Birimler başarıyla getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Birimler alınamadı');
        }
    }
}
