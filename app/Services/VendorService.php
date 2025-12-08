<?php

namespace App\Services;

use App\Repositories\VendorRepository;
use App\Services\Vendor\VendorAddressService;
use App\Services\Vendor\VendorBankAccountService;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class VendorService extends BaseService
{
    protected VendorRepository $repo;
    protected VendorAddressService $addressService;
    protected VendorBankAccountService $bankAccountService;

    public function __construct(
        VendorRepository $repo,
        VendorAddressService $addressService,
        VendorBankAccountService $bankAccountService
    ) {
        $this->repo = $repo;
        $this->addressService = $addressService;
        $this->bankAccountService = $bankAccountService;
    }

    // ==================== CRUD Operations ====================

    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function listOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at'])
    {
        return $this->repo->paginateOptimized($perPage, $filters, $select);
    }

    public function listForAdminResponse(int $perPage = 15, ?string $status = null)
    {
        $query = Vendor::with(['addresses' => function($q) {
                $q->where('is_primary', true);
            }, 'bankAccounts' => function($q) {
                $q->where('is_primary', true);
            }])
            ->withSum('payouts', 'amount')
            ->latest();

        if ($status) {
            $query->where('status', $status);
        } else {
            $query->whereNotNull('application_id')
                  ->where('status', 'active');
        }

        $paginator = $query->paginate($perPage);

        $data = [
            'data' => \App\Http\Resources\Api\V1\Admin\VendorResource::collection($paginator),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];

        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)
           ->setStatusCode(200)
           ->setMessage('Satıcılar listelendi')
           ->setData($data);

        return $sr;
    }

    public function find(int $id)
    {
        return $this->repo->find($id);
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            // Dosya yüklemeleri
            if (!empty($data['logo_file']) && $data['logo_file'] instanceof UploadedFile) {
                $path = $data['logo_file']->store("vendors/{$id}", 'public');
                $data['logo_path'] = $path;
                unset($data['logo_file']);
            }

            if (!empty($data['cover_file']) && $data['cover_file'] instanceof UploadedFile) {
                $path = $data['cover_file']->store("vendors/{$id}", 'public');
                $data['cover_path'] = $path;
                unset($data['cover_file']);
            }

            // Temel bilgileri güncelle
            $vendor = $this->repo->update($id, $data);

            // Adresleri senkronize et
            if (isset($data['addresses']) && is_array($data['addresses'])) {
                $this->addressService->sync($id, $data['addresses']);
            }

            // Banka hesaplarını senkronize et
            if (isset($data['bank_accounts']) && is_array($data['bank_accounts'])) {
                $this->bankAccountService->sync($id, $data['bank_accounts']);
            }

            return $vendor;
        });
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    // ==================== Backward Compatibility (Deprecated) ====================
    // Bu metodlar eski kodlarla uyumluluk için tutuldu.
    // Yeni kodlarda ilgili service'leri doğrudan kullanın.

    /**
     * @deprecated Use VendorAddressService::add() instead
     */
    public function addAddress(int $vendorId, array $data)
    {
        return $this->addressService->add($vendorId, $data);
    }

    /**
     * @deprecated Use VendorAddressService::list() instead
     */
    public function listAddresses(int $vendorId)
    {
        return $this->addressService->list($vendorId);
    }

    /**
     * @deprecated Use VendorAddressService::update() instead
     */
    public function updateAddress(int $vendorId, int $addressId, array $data)
    {
        return $this->addressService->update($vendorId, $addressId, $data);
    }

    /**
     * @deprecated Use VendorAddressService::delete() instead
     */
    public function deleteAddress(int $vendorId, int $addressId)
    {
        return $this->addressService->delete($vendorId, $addressId);
    }

    /**
     * @deprecated Use VendorBankAccountService::add() instead
     */
    public function addBankAccount(int $vendorId, array $data)
    {
        return $this->bankAccountService->add($vendorId, $data);
    }

    /**
     * @deprecated Use VendorBankAccountService::list() instead
     */
    public function listBankAccounts(int $vendorId)
    {
        return $this->bankAccountService->list($vendorId);
    }

    /**
     * @deprecated Use VendorBankAccountService::update() instead
     */
    public function updateBankAccount(int $vendorId, int $accountId, array $data)
    {
        return $this->bankAccountService->update($vendorId, $accountId, $data);
    }

    /**
     * @deprecated Use VendorBankAccountService::delete() instead
     */
    public function deleteBankAccount(int $vendorId, int $accountId)
    {
        return $this->bankAccountService->delete($vendorId, $accountId);
    }
}
