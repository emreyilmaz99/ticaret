<?php

namespace App\Services\Vendor;

use App\Services\BaseService;
use App\Models\Vendor;
use App\Models\VendorPayout;
use App\Repositories\Interfaces\VendorPayoutRepositoryInterface;
use Illuminate\Support\Facades\DB;

class VendorPayoutService extends BaseService
{
    protected VendorPayoutRepositoryInterface $payoutRepo;

    public function __construct(VendorPayoutRepositoryInterface $payoutRepo)
    {
        $this->payoutRepo = $payoutRepo;
    }

    /**
     * Ödeme talebi oluştur
     */
    public function request(int $vendorId, float $amount, array $options = [])
    {
        return DB::transaction(function () use ($vendorId, $amount, $options) {
            $vendor = Vendor::findOrFail($vendorId);

            $fee = $options['fee'] ?? 0;
            $total = $amount + $fee;

            if ($vendor->balance < $total) {
                throw new \Exception('Yetersiz bakiye');
            }

            $vendor->balance = $vendor->balance - $total;
            $vendor->save();

            $payout = $this->payoutRepo->create([
                'vendor_id' => $vendorId,
                'amount' => $amount,
                'fee' => $fee,
                'method' => $options['method'] ?? null,
                'status' => $options['status'] ?? 'pending',
                'reference' => $options['reference'] ?? null,
            ]);

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
     * Bakiye sorgula
     */
    public function getBalance(int $vendorId): float
    {
        $vendor = Vendor::findOrFail($vendorId);
        return (float) $vendor->balance;
    }

    /**
     * Ödeme durumunu güncelle (admin için)
     */
    public function updateStatus(int $payoutId, string $status, ?int $adminId = null)
    {
        return DB::transaction(function () use ($payoutId, $status, $adminId) {
            $payout = $this->payoutRepo->findById($payoutId);

            if (!$payout) {
                throw new \Exception('Payout not found');
            }

            // Eğer iptal ediliyorsa bakiyeyi geri yükle
            if ($status === 'cancelled' && $payout->status !== 'cancelled') {
                $vendor = Vendor::findOrFail($payout->vendor_id);
                $vendor->balance = $vendor->balance + $payout->amount + $payout->fee;
                $vendor->save();
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
