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


        // Get validated fields
        $data = $request->validated();

        // Password hashing is handled by the Vendor model mutator (`setPasswordAttribute`).
        // If a password is provided it will be hashed by the model when saved.

        // Handle file uploads (logo, cover) if present
        // Store on the 'public' disk under vendors/{id}/
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store("vendors/{$vendor->getKey()}", 'public');
            $data['logo_path'] = $logoPath;
        }

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store("vendors/{$vendor->getKey()}", 'public');
            $data['cover_path'] = $coverPath;
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
