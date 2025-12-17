<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\StoreTaxClassRequest;
use App\Http\Requests\Api\V1\Admin\UpdateTaxClassRequest;
use App\Services\Tax\TaxClassCrudService;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaxClassController extends Controller
{
    use ResponseHttp;

    protected TaxClassCrudService $service;

    public function __construct(TaxClassCrudService $service)
    {
        $this->service = $service;
    }

    /**
     * Liste tüm vergi sınıfları
     * GET /api/v1/admin/tax-classes
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['is_active']);
        $result = $this->service->list($filters);
        return $this->fromServiceResponse($result);
    }

    /**
     * Vergi sınıfı detayı
     * GET /api/v1/admin/tax-classes/{id}
     */
    public function show(int $id): JsonResponse
    {
        $result = $this->service->find($id);
        return $this->fromServiceResponse($result);
    }

    /**
     * Yeni vergi sınıfı oluştur
     * POST /api/v1/admin/tax-classes
     */
    public function store(StoreTaxClassRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $result = $this->service->create($validated);
        return $this->fromServiceResponse($result);
    }

    /**
     * Vergi sınıfını güncelle
     * PUT /api/v1/admin/tax-classes/{id}
     */
    public function update(UpdateTaxClassRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $result = $this->service->update($id, $validated);
        return $this->fromServiceResponse($result);
    }

    /**
     * Vergi sınıfını sil
     * DELETE /api/v1/admin/tax-classes/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $result = $this->service->delete($id);
        return $this->fromServiceResponse($result);
    }
}
