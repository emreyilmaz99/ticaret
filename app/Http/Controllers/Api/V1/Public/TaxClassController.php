<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Services\Tax\TaxClassCrudService;
use App\Services\Tax\TaxCalculationService;
use App\Traits\ResponseHttp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaxClassController extends Controller
{
    use ResponseHttp;

    protected TaxClassCrudService $crudService;
    protected TaxCalculationService $calculationService;

    public function __construct(
        TaxClassCrudService $crudService,
        TaxCalculationService $calculationService
    ) {
        $this->crudService = $crudService;
        $this->calculationService = $calculationService;
    }

    /**
     * Aktif vergi sınıflarını listele
     * GET /api/v1/tax-classes
     */
    public function index(): JsonResponse
    {
        $result = $this->crudService->getActive();
        return $this->fromServiceResponse($result);
    }

    /**
     * Vergi hesaplama (Satıcı ürün eklerken önizleme için)
     * POST /api/v1/tax-classes/calculate
     */
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tax_class_id' => 'required|exists:tax_classes,id',
            'price' => 'required|numeric|min:0',
        ]);

        $result = $this->calculationService->calculate(
            $validated['tax_class_id'],
            $validated['price']
        );

        return $this->fromServiceResponse($result);
    }
}
