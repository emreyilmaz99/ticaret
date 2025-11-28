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

    /**
     * Mark onboarding complete — vendor indicates they've finished step 2.
     * Only allowed when vendor currently has status `pre_approved`.
     */
    public function completeOnboarding(Request $request)
    {
        $vendor = $request->user();
        if (! $vendor) {
            return $this->error('Yetkisiz', 401);
        }

        // Basic guards: only transition pre_approved -> pending
        if ($vendor->status !== 'pre_approved') {
            return $this->error('Onboarding tamamlanamaz: mevcut statü uygun değil', 422);
        }

        // Optionally verify required fields exist (company_name, at least one address and bank account)
        $hasCompany = !empty($vendor->company_name);
        $hasAddress = $vendor->addresses()->exists();
        $hasBank = $vendor->bankAccounts()->exists();

        if (!($hasCompany && $hasAddress && $hasBank)) {
            return $this->error('Onboarding tamamlanmadan önce tüm zorunlu bilgiler doldurulmalıdır', 422);
        }

        // Update status to pending so admin can review full application
        $updated = $this->service->update($vendor->getKey(), ['status' => 'pending']);

        return $this->success(new VendorResource($updated), 'Onboarding tamamlandı; admin onayı bekleniyor', 200);
    }
}
