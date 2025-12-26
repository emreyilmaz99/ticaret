<?php

namespace App\Services\Vendor;

use App\Core\ServiceResponse;
use App\Http\Resources\Api\V1\Vendor\VendorEarningResource;
use App\Models\Vendor;
use App\Models\VendorEarning;
use Carbon\Carbon;

class VendorFinancialService
{
    /**
     * Get vendor dashboard financial stats
     */
    public function getDashboardStats(Vendor $vendor): ServiceResponse
    {
        try {
            $stats = [
                'available_balance' => $vendor->available_balance,
                'pending_balance' => $vendor->pending_balance,
                'total_earned' => $vendor->total_earned,
                'total_withdrawn' => $vendor->total_withdrawn,
                'total_earnings' => $vendor->earnings()->count(),
                'pending_earnings' => $vendor->earnings()->pending()->count(),
                'available_earnings' => $vendor->earnings()->available()->count(),
                'settled_earnings' => $vendor->earnings()->settled()->count(),
                'total_commission' => $vendor->earnings()->sum('commission_amount'),
                'total_withholding_tax' => $vendor->earnings()->sum('withholding_tax_amount'),
                'total_gross' => $vendor->earnings()->sum('gross_amount'),
            ];

            return (new ServiceResponse())
                ->setSuccess(true)
                ->setStatusCode(200)
                ->setMessage('Finansal özet başarıyla alındı')
                ->setData($stats);
        } catch (\Exception $e) {
            return (new ServiceResponse())
                ->setSuccess(false)
                ->setStatusCode(500)
                ->setMessage('Finansal özet alınamadı: ' . $e->getMessage());
        }
    }

    /**
     * Get vendor earnings with filters
     */
    public function getEarnings(Vendor $vendor, array $filters = [], int $perPage = 20): ServiceResponse
    {
        try {
            $query = $vendor->earnings()->with(['order', 'orderItem.product', 'payout']);

            // Filter by status
            if (!empty($filters['status'])) {
                $query->where('earning_status', $filters['status']);
            }

            // Filter by date range
            if (!empty($filters['from'])) {
                $query->where('created_at', '>=', Carbon::parse($filters['from']));
            }
            if (!empty($filters['to'])) {
                $query->where('created_at', '<=', Carbon::parse($filters['to'])->endOfDay());
            }

            // Filter by order number
            if (!empty($filters['order_number'])) {
                $query->whereHas('order', function ($q) use ($filters) {
                    $q->where('order_number', 'like', '%' . $filters['order_number'] . '%');
                });
            }

            $earnings = $query->latest()->paginate($perPage);

            // Transform with Resource
            $transformed = VendorEarningResource::collection($earnings);

            return (new ServiceResponse())
                ->setSuccess(true)
                ->setStatusCode(200)
                ->setMessage('Kazançlar başarıyla alındı')
                ->setData($transformed);
        } catch (\Exception $e) {
            return (new ServiceResponse())
                ->setSuccess(false)
                ->setStatusCode(500)
                ->setMessage('Kazançlar alınamadı: ' . $e->getMessage());
        }
    }

    /**
     * Get earnings chart data
     */
    public function getEarningsChart(Vendor $vendor, string $period = 'daily', ?Carbon $from = null, ?Carbon $to = null): ServiceResponse
    {
        try {
            $from = $from ?? Carbon::now()->subDays(30);
            $to = $to ?? Carbon::now();

            $query = $vendor->earnings()
                ->whereIn('earning_status', ['available', 'settled'])
                ->whereBetween('created_at', [$from, $to]);

            // Use if-else for PHP 7.4 compatibility
            if ($period === 'weekly') {
                $groupBy = 'YEARWEEK(created_at)';
            } elseif ($period === 'monthly') {
                $groupBy = 'DATE_FORMAT(created_at, "%Y-%m")';
            } elseif ($period === 'yearly') {
                $groupBy = 'YEAR(created_at)';
            } else {
                $groupBy = 'DATE(created_at)';
            }

            $chartData = $query
                ->selectRaw("{$groupBy} as period, SUM(net_earning) as total")
                ->groupByRaw($groupBy)
                ->orderBy('period')
                ->get()
                ->map(function ($item) use ($period) {
                    return [
                        'period' => $item->period,
                        'total' => (float) $item->total,
                        'formatted' => '₺' . number_format($item->total, 2, ',', '.'),
                    ];
                });

            return (new ServiceResponse())
                ->setSuccess(true)
                ->setStatusCode(200)
                ->setMessage('Grafik verisi başarıyla alındı')
                ->setData($chartData);
        } catch (\Exception $e) {
            return (new ServiceResponse())
                ->setSuccess(false)
                ->setStatusCode(500)
                ->setMessage('Grafik verisi alınamadı: ' . $e->getMessage());
        }
    }

    /**
     * Get withholding tax report
     */
    public function getWithholdingTaxReport(Vendor $vendor, int $year, ?int $quarter = null): ServiceResponse
    {
        try {
            $query = $vendor->earnings()
                ->whereYear('created_at', $year);

            if ($quarter) {
                $startMonth = ($quarter - 1) * 3 + 1;
                $endMonth = $startMonth + 2;
                $startDate = Carbon::create($year, $startMonth, 1)->startOfMonth();
                $endDate = Carbon::create($year, $endMonth, 1)->endOfMonth();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }

            $report = [
                'year' => $year,
                'quarter' => $quarter,
                'total_gross' => (float) $query->sum('gross_amount'),
                'total_commission' => (float) $query->sum('commission_amount'),
                'total_withholding_tax' => (float) $query->sum('withholding_tax_amount'),
                'total_net' => (float) $query->sum('net_earning'),
                'earnings_count' => $query->count(),
            ];

            return (new ServiceResponse())
                ->setSuccess(true)
                ->setStatusCode(200)
                ->setMessage('Stopaj raporu başarıyla oluşturuldu')
                ->setData($report);
        } catch (\Exception $e) {
            return (new ServiceResponse())
                ->setSuccess(false)
                ->setStatusCode(500)
                ->setMessage('Stopaj raporu oluşturulamadı: ' . $e->getMessage());
        }
    }
}
