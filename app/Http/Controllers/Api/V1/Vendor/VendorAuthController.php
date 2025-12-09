<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Admin\LoginRequest;
use App\Http\Resources\Api\V1\Admin\UserResource;
use App\Models\Vendor;
use App\Services\Auth\AuthService;

use Illuminate\Support\Facades\Hash;

class VendorAuthController extends BaseVendorController
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $sr = $this->authService->vendorLogin($data);

        return $this->fromServiceResponse($sr);
    }

    public function me()
    {
        $vendor = request()->user();

        // Load relations that onboarding needs
        $vendor->loadMissing(['addresses', 'bankAccounts']);

        $sr = new \App\Core\ServiceResponse();
        $sr->setSuccess(true)
           ->setStatusCode(200)
           ->setMessage('OK')
           ->setData([
               'vendor' => [
                   'id' => $vendor->id,
                   'name' => $vendor->name,
                   'email' => $vendor->email,
                   'company_name' => $vendor->company_name,
                   'tax_id' => $vendor->tax_id,
                   'phone' => $vendor->phone,
                   'logo_path' => $vendor->logo_path,
                   'cover_path' => $vendor->cover_path,
                   'status' => $vendor->status ?? null,
                   'roles' => $vendor->roles->pluck('name'),
                   'addresses' => $vendor->addresses->map(function($a){
                       return [
                           'id' => $a->id,
                           'label' => $a->label,
                           'country' => $a->country,
                           'city' => $a->city,
                           'address_line' => $a->address_line,
                           'postal_code' => $a->postal_code,
                           'is_primary' => (bool) $a->is_primary,
                       ];
                   })->toArray(),
                   'bank_accounts' => $vendor->bankAccounts->map(function($b){
                       return [
                           'id' => $b->id,
                           'bank_name' => $b->bank_name,
                           'account_holder' => $b->account_holder,
                           'iban' => $b->iban,
                           'currency' => $b->currency,
                           'is_primary' => (bool) $b->is_primary,
                       ];
                   })->toArray(),
                   'created_at' => $vendor->created_at?->toIso8601String(),
               ],
           ]);

        return $this->fromServiceResponse($sr);
    }

    public function logout(\Illuminate\Http\Request $request)
    {
        $user = $request->user();

        $sr = $this->authService->logout($user);

        return $this->fromServiceResponse($sr);
    }
}
