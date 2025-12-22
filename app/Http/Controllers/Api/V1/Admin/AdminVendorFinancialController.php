<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Core\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Vendor\VendorEarningResource;
use App\Models\Vendor;
use App\Models\VendorEarning;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminVendorFinancialController extends Controller
{
    use ApiResponse;

    /**
     * Platform genel finansal dashboard
     * GET /admin/finance/dashboard
     */
    public function platformDashboard()
    {
        $stats = [
            'total_vendors' => Vendor::count(),
            'active_vendors' => Vendor::where('status', 'active')->count(),
            
            // Toplam kazançlar
            'total_earnings' => VendorEarning::sum('net_earning'),
            'total_commission' => VendorEarning::sum('commission_amount'),
            'total_withholding_tax' => VendorEarning::sum('withholding_tax_amount'),
            
            // Durumlara göre
            'pending_earnings' => VendorEarning::pending()->sum('net_earning'),
            'available_earnings' => VendorEarning::available()->sum('net_earning'),
            'settled_earnings' => VendorEarning::settled()->sum('net_earning'),
            
            // Sayılar
            'total_earnings_count' => VendorEarning::count(),
            'pending_count' => VendorEarning::pending()->count(),
            'available_count' => VendorEarning::available()->count(),
            'settled_count' => VendorEarning::settled()->count(),
            
            // Bu ay
            'current_month_commission' => VendorEarning::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('commission_amount'),
            'current_month_withholding_tax' => VendorEarning::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('withholding_tax_amount'),
        ];

        return $this->success('Platform finansal özet', $stats);
    }

    /**
     * Komisyon raporu
     * GET /admin/finance/commission-report
     */
    public function commissionReport(Request $request)
    {
        $query = VendorEarning::query()
            ->select([
                'vendor_id',
                DB::raw('COUNT(*) as earnings_count'),
                DB::raw('SUM(gross_amount) as total_gross'),
                DB::raw('SUM(commission_amount) as total_commission'),
                DB::raw('SUM(withholding_tax_amount) as total_withholding_tax'),
                DB::raw('SUM(net_earning) as total_net'),
            ])
            ->with('vendor:id,name,slug,email');

        // Date filter
        if ($request->filled('from_date')) {
            $query->where('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->where('created_at', '<=', $request->to_date);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('earning_status', $request->status);
        }

        $report = $query->groupBy('vendor_id')
            ->orderByDesc('total_commission')
            ->paginate($request->input('per_page', 20));

        return $this->success('Komisyon raporu', $report);
    }

    /**
     * Stopaj raporu
     * GET /admin/finance/withholding-tax-report
     */
    public function withholdingTaxReport(Request $request)
    {
        $year = $request->input('year', now()->year);
        $quarter = $request->input('quarter'); // 1,2,3,4

        $query = VendorEarning::query()
            ->select([
                'vendor_id',
                DB::raw('YEAR(created_at) as year'),
                DB::raw('QUARTER(created_at) as quarter'),
                DB::raw('COUNT(*) as transactions_count'),
                DB::raw('SUM(gross_amount) as total_gross'),
                DB::raw('SUM(withholding_tax_amount) as total_withholding_tax'),
                DB::raw('SUM(net_earning) as total_net'),
            ])
            ->with('vendor:id,name,slug,email,tax_number')
            ->whereYear('created_at', $year);

        if ($quarter) {
            $query->whereRaw('QUARTER(created_at) = ?', [$quarter]);
        }

        $report = $query->groupBy('vendor_id', 'year', 'quarter')
            ->orderBy('year', 'desc')
            ->orderBy('quarter', 'desc')
            ->orderByDesc('total_withholding_tax')
            ->paginate($request->input('per_page', 20));

        return $this->success('Stopaj raporu', $report);
    }

    /**
     * Vendor detaylı finansal bilgiler
     * GET /admin/finance/vendor/{vendorId}
     */
    public function vendorFinancials(int $vendorId, Request $request)
    {
        $vendor = Vendor::findOrFail($vendorId);

        $summary = [
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'slug' => $vendor->slug,
                'email' => $vendor->email,
                'tax_number' => $vendor->tax_number,
            ],
            'balances' => [
                'available' => $vendor->available_balance,
                'pending' => $vendor->pending_balance,
                'total_earned' => $vendor->total_earned,
                'total_withdrawn' => $vendor->total_withdrawn,
            ],
            'stats' => [
                'total_earnings_count' => $vendor->earnings()->count(),
                'pending_count' => $vendor->earnings()->pending()->count(),
                'available_count' => $vendor->earnings()->available()->count(),
                'settled_count' => $vendor->earnings()->settled()->count(),
            ],
            'totals' => [
                'total_commission' => $vendor->earnings()->sum('commission_amount'),
                'total_withholding_tax' => $vendor->earnings()->sum('withholding_tax_amount'),
                'total_gross' => $vendor->earnings()->sum('gross_amount'),
            ],
        ];

        // Earnings listesi
        $earningsQuery = $vendor->earnings()->with(['order', 'orderItem.product']);

        if ($request->filled('status')) {
            $earningsQuery->where('earning_status', $request->status);
        }

        if ($request->filled('from_date')) {
            $earningsQuery->where('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $earningsQuery->where('created_at', '<=', $request->to_date);
        }

        $earnings = $earningsQuery->latest()
            ->paginate($request->input('per_page', 20));

        return $this->success('Vendor finansal detayları', [
            'summary' => $summary,
            'earnings' => VendorEarningResource::collection($earnings),
            'pagination' => [
                'current_page' => $earnings->currentPage(),
                'last_page' => $earnings->lastPage(),
                'per_page' => $earnings->perPage(),
                'total' => $earnings->total(),
            ],
        ]);
    }

    /**
     * Vendor kazanç detayı
     * GET /admin/finance/earning/{earningId}
     */
    public function earningDetail(int $earningId)
    {
        $earning = VendorEarning::with([
            'vendor:id,name,slug,email',
            'order:id,order_number,customer_name,status',
            'orderItem.product:id,name,slug',
            'payout:id,amount,status,created_at'
        ])->findOrFail($earningId);

        return $this->success('Kazanç detayı', new VendorEarningResource($earning));
    }
}
