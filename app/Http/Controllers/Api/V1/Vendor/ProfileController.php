<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Vendor\UpdateProfileRequest;
use App\Http\Requests\Api\V1\Vendor\UpdateVendorCategoriesRequest;
use App\Http\Resources\Api\V1\Admin\VendorResource;
use App\Services\Vendor\VendorService;
use App\Services\Vendor\VendorCategoryService;
use Illuminate\Http\Request;

class ProfileController extends BaseVendorController
{
    protected VendorService $service;
    protected VendorCategoryService $categoryService;

    public function __construct(VendorService $service, VendorCategoryService $categoryService)
    {
        $this->service = $service;
        $this->categoryService = $categoryService;
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

        // Pass uploaded file objects to the service to handle storage and processing there
        if ($request->hasFile('logo')) {
            $data['logo_file'] = $request->file('logo');
        }

        if ($request->hasFile('cover')) {
            $data['cover_file'] = $request->file('cover');
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
     * Mark onboarding complete — vendor indicates they've finished setup.
     * This is now mainly for backward compatibility.
     * Vendors created via full application flow already have onboarding_completed set appropriately.
     */
    public function completeOnboarding(Request $request)
    {
        $vendor = $request->user();
        if (! $vendor) {
            return $this->error('Yetkisiz', 401);
        }

        // Only allow if vendor is active
        if ($vendor->status !== 'active') {
            return $this->error('Onboarding tamamlanamaz: Hesabınız henüz aktif değil', 422);
        }

        // If already completed, just return success
        if ($vendor->onboarding_completed) {
            return $this->success(new VendorResource($vendor), 'Onboarding zaten tamamlanmış', 200);
        }

        // Optionally verify required fields exist (company_name, at least one address and bank account)
        $hasCompany = !empty($vendor->company_name);
        $hasAddress = $vendor->addresses()->exists();
        $hasBank = $vendor->bankAccounts()->exists();

        if (!($hasCompany && $hasAddress && $hasBank)) {
            return $this->error('Onboarding tamamlanmadan önce tüm zorunlu bilgiler doldurulmalıdır (şirket adı, adres, banka hesabı)', 422);
        }

        // Update onboarding_completed flag
        $updated = $this->service->update($vendor->getKey(), ['onboarding_completed' => true]);

        return $this->success(new VendorResource($updated), 'Onboarding tamamlandı', 200);
    }

    /**
     * Get vendor's selected categories
     */
    public function myCategories(Request $request)
    {
        $vendor = $request->user();
        if (! $vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $result = $this->categoryService->getMyCategories($vendor->id);

        return $this->fromServiceResponse($result);
    }

    /**
     * Get vendor's allowed categories for product creation (selected + all children)
     */
    public function myCategoriesForProducts(Request $request)
    {
        $vendor = $request->user();
        if (! $vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $result = $this->categoryService->getMyCategoriesForProducts($vendor->id);

        return $this->fromServiceResponse($result);
    }

    /**
     * Update vendor's selected categories (vendor can freely choose)
     */
    public function updateMyCategories(UpdateVendorCategoriesRequest $request)
    {
        $vendor = $request->user();
        if (! $vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $result = $this->categoryService->updateMyCategories($vendor->id, $request->input('category_ids'));

        return $this->fromServiceResponse($result);
    }
}
