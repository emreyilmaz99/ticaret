<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorPayoutServiceInterface;
use App\Services\BaseService;
use App\Models\Vendor;
use App\Models\VendorPayout;
use App\Models\VendorEarning;
use App\Repositories\Interfaces\VendorPayoutRepositoryInterface;
use Illuminate\Support\Facades\DB;

class VendorPayoutService extends BaseService implements VendorPayoutServiceInterface
{
    protected VendorPayoutRepositoryInterface $payoutRepo;

    public function __construct(VendorPayoutRepositoryInterface $payoutRepo)
    {
        $this->payoutRepo = $payoutRepo;
    }

    /**
     * Ödeme talebi oluştur - FIFO mantığıyla earnings'leri settle et
     */
    public function request(int $vendorId, float $amount, array $options = [])
    {
        return DB::transaction(function () use ($vendorId, $amount, $options) {
            $vendor = Vendor::findOrFail($vendorId);

            $fee = config('finance.payout.processing_fee', 5);
            $requestedAmount = $amount;
            
            // Check available balance
            if ($vendor->available_balance < $requestedAmount) {
                throw new \Exception('Yetersiz çekilebilir bakiye. Mevcut: ₺' . number_format($vendor->available_balance, 2));
            }

            // Create payout record
            $payout = $this->payoutRepo->create([
                'vendor_id' => $vendorId,
                'amount' => $requestedAmount,
                'fee' => $fee,
                'method' => $options['method'] ?? null,
                'status' => 'pending',
                'reference' => $options['reference'] ?? null,
            ]);

            // Get available earnings in FIFO order (oldest first)
            $availableEarnings = VendorEarning::byVendor($vendorId)
                ->available()
                ->orderBy('created_at', 'asc')
                ->get();

            // Mark earnings as settled until we reach the payout amount
            $remainingAmount = $requestedAmount;
            foreach ($availableEarnings as $earning) {
                if ($remainingAmount <= 0) {
                    break;
                }

                $earning->markSettled($payout->id);
                $remainingAmount -= $earning->net_earning;
            }

            // Clear vendor balance cache
            $vendor->clearBalanceCache();

            return $payout;
        });
    }

    /**
     * Ödeme listele
     */
    public function list(int $vendorId)
    {
        return $this->payoutRepo->listByVendor($vendorId);
    }

    /**
     * Bakiye sorgula - Available balance döndür
     */
    public function getBalance(int $vendorId): float
    {
        $vendor = Vendor::findOrFail($vendorId);
        return (float) $vendor->available_balance;
    }

    /**
     * Ödeme durumunu güncelle (admin için) - Cancelled durumunda earnings'leri available'a geri al
     */
    public function updateStatus(int $payoutId, string $status, ?int $adminId = null)
    {
        return DB::transaction(function () use ($payoutId, $status, $adminId) {
            $payout = $this->payoutRepo->findById($payoutId);

            if (!$payout) {
                throw new \Exception('Payout not found');
            }

            // Eğer iptal ediliyorsa earnings'leri available durumuna geri al
            if ($status === 'cancelled' && $payout->status !== 'cancelled') {
                $earnings = VendorEarning::where('payout_id', $payoutId)->get();
                
                foreach ($earnings as $earning) {
                    $earning->markAvailable();
                }

                // Clear vendor cache
                $vendor = Vendor::findOrFail($payout->vendor_id);
                $vendor->clearBalanceCache();
            }

            return $this->payoutRepo->update($payoutId, [
                'status' => $status,
                'processed_by' => $adminId,
                'processed_at' => now(),
            ]);
        });
    }

    /**
     * Tüm ödemeleri listele (admin için)
     */
    public function listAll(int $perPage = 15)
    {
        return VendorPayout::with(['vendor:id,name,slug'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Ödeme bul
     */
    public function find(int $payoutId)
    {
        return $this->payoutRepo->findById($payoutId);
    }
}
