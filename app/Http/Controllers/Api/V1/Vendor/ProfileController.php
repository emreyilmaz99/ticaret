<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Vendor\UpdateProfileRequest;
use App\Http\Resources\Api\V1\Admin\VendorResource;
use App\Services\VendorService;
use Illuminate\Http\Request;

class ProfileController extends BaseVendorController
{
    protected VendorService $service;

    public function __construct(VendorService $service)
    {
        $this->service = $service;
    }

    public function update(UpdateProfileRequest $request)
    {
        $vendor = $request->user();
        if (! $vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $updated = $this->service->update($vendor->getKey(), $data);

        return $this->success(new VendorResource($updated), 'Profil güncellendi', 200);
    }

    public function destroy(Request $request)
    {
        $vendor = $request->user();
        if (! $vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $this->service->delete($vendor->getKey());

        return $this->success(null, 'Hesabınız başarıyla silindi (soft delete)', 200);
    }
}
