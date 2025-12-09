<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Api\V1\Vendor\BaseVendorController;
use App\Http\Requests\Api\V1\Vendor\UpdateProfileRequest;
use App\Http\Resources\Api\V1\Admin\VendorResource;
use App\Services\Vendor\VendorService;
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

        $categories = $vendor->allowedCategories()
            ->with('parent:id,name,slug')
            ->orderBy('name')
            ->get(['categories.id', 'categories.name', 'categories.slug', 'categories.icon', 'categories.parent_id']);

        return $this->success([
            'categories' => $categories,
            'total' => $categories->count()
        ]);
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

        // Get vendor's selected category IDs
        $selectedCategoryIds = $vendor->allowedCategories()->pluck('categories.id')->toArray();

        if (empty($selectedCategoryIds)) {
            return $this->success([
                'categories' => [],
                'total' => 0
            ]);
        }

        // Get all descendant category IDs recursively
        $allCategoryIds = $this->getAllDescendantIds($selectedCategoryIds);

        // Fetch all these categories with parent info
        $categories = \App\Models\Category::whereIn('id', $allCategoryIds)
            ->where('is_active', true)
            ->with('parent:id,name,slug')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon', 'image', 'parent_id']);

        return $this->success([
            'categories' => $categories,
            'total' => $categories->count()
        ]);
    }

    /**
     * Helper: Get all descendant category IDs including given IDs
     */
    private function getAllDescendantIds(array $categoryIds): array
    {
        $allIds = $categoryIds;
        
        // Get children of these categories
        $childIds = \App\Models\Category::whereIn('parent_id', $categoryIds)
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();
        
        if (!empty($childIds)) {
            // Recursively get children's children
            $allIds = array_merge($allIds, $this->getAllDescendantIds($childIds));
        }
        
        return array_unique($allIds);
    }

    /**
     * Update vendor's selected categories (vendor can freely choose)
     */
    public function updateMyCategories(Request $request)
    {
        $vendor = $request->user();
        if (! $vendor) {
            return $this->error('Yetkisiz', 401);
        }

        $request->validate([
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id'
        ], [
            'category_ids.required' => 'En az bir kategori seçmelisiniz',
            'category_ids.min' => 'En az bir kategori seçmelisiniz',
            'category_ids.*.exists' => 'Geçersiz kategori'
        ]);

        $categoryIds = $request->input('category_ids');

        // Sync categories - vendor freely chooses
        $vendor->allowedCategories()->sync($categoryIds);

        $categories = $vendor->allowedCategories()
            ->with('parent:id,name,slug')
            ->orderBy('name')
            ->get(['categories.id', 'categories.name', 'categories.slug', 'categories.icon', 'categories.parent_id']);

        return $this->success([
            'categories' => $categories,
            'total' => $categories->count()
        ], 'Kategoriler güncellendi');
    }
}
