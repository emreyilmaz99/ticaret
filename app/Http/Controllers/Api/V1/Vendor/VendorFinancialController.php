<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Vendor\VendorEarningResource;
use App\Services\Vendor\VendorFinancialService;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class VendorFinancialController extends Controller
{
    use ResponseHttp;

    public function __construct(
        protected VendorFinancialService $financialService
    ) {}

    /**
     * GET /api/v1/vendor/finance/dashboard
     * Get vendor financial dashboard stats
     */
    public function dashboard(Request $request)
    {
        $vendor = $request->user();

        $result = $this->financialService->getDashboardStats($vendor);

        return $this->fromServiceResponse($result);
    }

    /**
     * GET /api/v1/vendor/finance/earnings
     * Get vendor earnings list with pagination and filters
     */
    public function earnings(Request $request)
    {
        $vendor = $request->user();

        $filters = [
            'status' => $request->input('status'),
            'from' => $request->input('from'),
            'to' => $request->input('to'),
            'order_number' => $request->input('order_number'),
        ];

        // Remove null values
        $filters = array_filter($filters, fn($value) => $value !== null);

        $perPage = $request->integer('per_page', 20);

        $result = $this->financialService->getEarnings($vendor, $filters, $perPage);

        if (!$result->isSuccess()) {
            return $this->fromServiceResponse($result);
        }

        $paginator = $result->getData();

        return VendorEarningResource::collection($paginator);
    }

    /**
     * GET /api/v1/vendor/finance/chart
     * Get earnings chart data
     */
    public function chart(Request $request)
    {
        $vendor = $request->user();

        $period = $request->input('period', 'daily'); // daily, weekly, monthly
        $from = $request->input('from') ? \Carbon\Carbon::parse($request->input('from')) : null;
        $to = $request->input('to') ? \Carbon\Carbon::parse($request->input('to')) : null;

        $result = $this->financialService->getEarningsChart($vendor, $period, $from, $to);

        return $this->fromServiceResponse($result);
    }

    /**
     * GET /api/v1/vendor/finance/tax-report
     * Get withholding tax report
     */
    public function taxReport(Request $request)
    {
        $vendor = $request->user();

        $year = $request->integer('year', now()->year);
        $quarter = $request->integer('quarter'); // 1, 2, 3, 4 or null for full year

        $result = $this->financialService->getWithholdingTaxReport($vendor, $year, $quarter);

        return $this->fromServiceResponse($result);
    }
}
