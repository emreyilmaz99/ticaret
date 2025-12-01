<?php

namespace App\Services;

use App\Repositories\VendorRepository;
use App\Repositories\Interfaces\VendorAddressRepositoryInterface;
use App\Repositories\Interfaces\VendorBankAccountRepositoryInterface;
use App\Repositories\Interfaces\VendorPayoutRepositoryInterface;
use App\Repositories\Interfaces\VendorMediaRepositoryInterface;
use App\Repositories\Interfaces\VendorSettingRepositoryInterface;
use App\Repositories\Interfaces\VendorMetadataRepositoryInterface;
use App\Repositories\Interfaces\VendorRatingRepositoryInterface;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class VendorService extends BaseService
{
    protected VendorRepository $repo;
    protected VendorAddressRepositoryInterface $addressRepo;
    protected VendorBankAccountRepositoryInterface $bankRepo;
    protected VendorPayoutRepositoryInterface $payoutRepo;
    protected VendorMediaRepositoryInterface $mediaRepo;
    protected VendorSettingRepositoryInterface $settingRepo;
    protected VendorMetadataRepositoryInterface $metadataRepo;
    protected VendorRatingRepositoryInterface $ratingRepo;

    public function __construct(
        VendorRepository $repo,
        VendorAddressRepositoryInterface $addressRepo,
        VendorBankAccountRepositoryInterface $bankRepo,
        VendorPayoutRepositoryInterface $payoutRepo,
        VendorMediaRepositoryInterface $mediaRepo,
        VendorSettingRepositoryInterface $settingRepo,
        VendorMetadataRepositoryInterface $metadataRepo,
        VendorRatingRepositoryInterface $ratingRepo
    ) {
        $this->repo = $repo;
        $this->addressRepo = $addressRepo;
        $this->bankRepo = $bankRepo;
        $this->payoutRepo = $payoutRepo;
        $this->mediaRepo = $mediaRepo;
        $this->settingRepo = $settingRepo;
        $this->metadataRepo = $metadataRepo;
        $this->ratingRepo = $ratingRepo;
    }

    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    /**
     * Return a paginated, optimized list that uses Query Builder to avoid Eloquent model hydration.
     * Useful for large lists where only a few columns are needed.
     *
     * @param int $perPage
     * @param array $filters
     * @param array $select
     * @return mixed
     */
    public function listOptimized(int $perPage = 15, array $filters = [], array $select = ['id','name','email','created_at'])
    {
        return $this->repo->paginateOptimized($perPage, $filters, $select);
    }

    /**
     * Wrapper that returns a ServiceResponse compatible payload for admin listing.
     */
    public function listForAdminResponse(int $perPage = 15)
    {
        // Use Eloquent to load relations and aggregates
        // Only show vendors with completed applications (application_id is not null)
        // Only show active vendors (status = 'active')
        $paginator = Vendor::with(['addresses' => function($q) {
                $q->where('is_primary', true);
            }, 'bankAccounts' => function($q) {
                $q->where('is_primary', true);
            }])
            ->whereNotNull('application_id') // Only vendors who completed full application
            ->where('status', 'active') // Only active vendors
            ->withSum('payouts', 'amount') // Calculate total revenue
            ->latest()
            ->paginate($perPage);

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
            // handle file uploads if provided as UploadedFile instances
            if (! empty($data['logo_file']) && $data['logo_file'] instanceof UploadedFile) {
                $path = $data['logo_file']->store("vendors/{$id}", 'public');
                $data['logo_path'] = $path;
                unset($data['logo_file']);
            }

            if (! empty($data['cover_file']) && $data['cover_file'] instanceof UploadedFile) {
                $path = $data['cover_file']->store("vendors/{$id}", 'public');
                $data['cover_path'] = $path;
                unset($data['cover_file']);
            }

            // 1. Update basic info
            $vendor = $this->repo->update($id, $data);

            // 2. Sync Addresses if provided
            if (isset($data['addresses']) && is_array($data['addresses'])) {
                // Strategy: Delete all and recreate, or update existing?
                // For simplicity in this "Edit Modal" context, we can update/create.
                // But to handle deletions, "sync" logic is better.
                // Let's assume the frontend sends the FULL list of desired state.
                
                // Get IDs of addresses to keep
                $keepIds = collect($data['addresses'])->pluck('id')->filter()->toArray();
                
                // Delete removed addresses
                $this->addressRepo->deleteByVendor($id, $keepIds);

                foreach ($data['addresses'] as $addrData) {
                    if (isset($addrData['id'])) {
                        $this->addressRepo->update($addrData['id'], $addrData);
                    } else {
                        $addrData['vendor_id'] = $id;
                        $this->addressRepo->create($addrData);
                    }
                }
            }

            // 3. Sync Bank Accounts if provided
            if (isset($data['bank_accounts']) && is_array($data['bank_accounts'])) {
                $keepIds = collect($data['bank_accounts'])->pluck('id')->filter()->toArray();
                $this->bankRepo->deleteByVendor($id, $keepIds);

                foreach ($data['bank_accounts'] as $bankData) {
                    if (isset($bankData['id'])) {
                        $this->bankRepo->update($bankData['id'], $bankData);
                    } else {
                        $bankData['vendor_id'] = $id;
                        $this->bankRepo->create($bankData);
                    }
                }
            }

            return $vendor;
        });
    }

    public function delete(int $id): bool
    {
        return $this->repo->delete($id);
    }

    /**
     * Addresses
     */
    public function addAddress(int $vendorId, array $data)
    {
        if (!empty($data['is_primary'])) {
            $this->addressRepo->clearPrimaryForVendor($vendorId);
        }

        $data['vendor_id'] = $vendorId;
        return $this->addressRepo->create($data);
    }

    public function listAddresses(int $vendorId)
    {
        return $this->addressRepo->listByVendor($vendorId);
    }

    /**
     * Bank accounts
     */
    public function addBankAccount(int $vendorId, array $data)
    {
        if (!empty($data['is_primary'])) {
            $this->bankRepo->clearPrimaryForVendor($vendorId);
        }

        $data['vendor_id'] = $vendorId;
        return $this->bankRepo->create($data);
    }

    public function listBankAccounts(int $vendorId)
    {
        return $this->bankRepo->listByVendor($vendorId);
    }

    public function updateAddress(int $vendorId, int $addressId, array $data)
    {
        $address = $this->addressRepo->findByVendorAndId($vendorId, $addressId);
        
        if (!$address) {
            throw new \Exception('Address not found');
        }

        if (!empty($data['is_primary'])) {
            $this->addressRepo->clearPrimaryForVendor($vendorId);
        }

        return $this->addressRepo->update($addressId, $data);
    }

    public function deleteAddress(int $vendorId, int $addressId)
    {
        $address = $this->addressRepo->findByVendorAndId($vendorId, $addressId);
        
        if (!$address) {
            throw new \Exception('Address not found');
        }
        
        return $this->addressRepo->delete($addressId);
    }

    public function updateBankAccount(int $vendorId, int $accountId, array $data)
    {
        $account = $this->bankRepo->findByVendorAndId($vendorId, $accountId);
        
        if (!$account) {
            throw new \Exception('Bank account not found');
        }

        if (!empty($data['is_primary'])) {
            $this->bankRepo->clearPrimaryForVendor($vendorId);
        }

        return $this->bankRepo->update($accountId, $data);
    }

    public function deleteBankAccount(int $vendorId, int $accountId)
    {
        $account = $this->bankRepo->findByVendorAndId($vendorId, $accountId);
        
        if (!$account) {
            throw new \Exception('Bank account not found');
        }
        
        return $this->bankRepo->delete($accountId);
    }

    /**
     * Payouts
     */
    public function requestPayout(int $vendorId, float $amount, array $options = [])
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

    public function listPayouts(int $vendorId)
    {
        return $this->payoutRepo->listByVendor($vendorId);
    }

    public function getBalance(int $vendorId)
    {
        $vendor = Vendor::findOrFail($vendorId);
        return $vendor->balance;
    }

    // ==================== Media Management ====================

    /**
     * Upload and store vendor media (logo, cover, banner, document)
     */
    public function uploadMedia(int $vendorId, UploadedFile $file, string $type = 'logo'): \App\Core\ServiceResponse
    {
        try {
            // Deactivate old media of the same type
            $this->mediaRepo->deactivateAllByType($vendorId, $type);

            // Store file
            $path = $file->store("vendors/{$vendorId}/{$type}", 'public');
            
            // Create media record
            $media = $this->mediaRepo->create([
                'vendor_id' => $vendorId,
                'type' => $type,
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'is_active' => true,
            ]);

            return $this->successResponse($media, 'Media uploaded successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to upload media');
        }
    }

    /**
     * Get active media by type
     */
    public function getActiveMedia(int $vendorId, string $type): ?\App\Models\VendorMedia
    {
        return $this->mediaRepo->findActiveByVendorAndType($vendorId, $type);
    }

    /**
     * List all media for vendor
     */
    public function listMedia(int $vendorId)
    {
        return $this->mediaRepo->listByVendor($vendorId);
    }

    /**
     * Delete media
     */
    public function deleteMedia(int $vendorId, int $mediaId): \App\Core\ServiceResponse
    {
        try {
            $media = $this->mediaRepo->findByVendorAndId($vendorId, $mediaId);
            
            if (!$media) {
                return $this->errorResponse('Media not found', 404);
            }

            // Delete file from storage
            Storage::disk('public')->delete($media->file_path);
            
            // Delete record
            $this->mediaRepo->delete($mediaId);

            return $this->successResponse(null, 'Media deleted successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to delete media');
        }
    }

    // ==================== Settings Management ====================

    /**
     * Set vendor setting (with auto type detection)
     */
    public function setSetting(int $vendorId, string $key, $value): \App\Core\ServiceResponse
    {
        try {
            $setting = $this->settingRepo->upsert($vendorId, $key, $value);
            return $this->successResponse($setting, 'Setting saved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to save setting');
        }
    }

    /**
     * Get vendor setting with typed value
     */
    public function getSetting(int $vendorId, string $key, $default = null)
    {
        $setting = $this->settingRepo->findByVendorAndKey($vendorId, $key);
        return $setting ? $setting->getTypedValueAttribute() : $default;
    }

    /**
     * Get all settings for vendor as key-value array
     */
    public function getAllSettings(int $vendorId): array
    {
        $settings = $this->settingRepo->listByVendor($vendorId);
        $result = [];
        
        foreach ($settings as $setting) {
            $result[$setting->setting_key] = $setting->getTypedValueAttribute();
        }
        
        return $result;
    }

    /**
     * Delete vendor setting
     */
    public function deleteSetting(int $vendorId, string $key): \App\Core\ServiceResponse
    {
        try {
            $deleted = $this->settingRepo->deleteByVendorAndKey($vendorId, $key);
            
            if (!$deleted) {
                return $this->errorResponse('Setting not found', 404);
            }

            return $this->successResponse(null, 'Setting deleted successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to delete setting');
        }
    }

    // ==================== Metadata Management ====================

    /**
     * Set vendor metadata
     */
    public function setMetadata(int $vendorId, string $key, string $value): \App\Core\ServiceResponse
    {
        try {
            $metadata = $this->metadataRepo->upsert($vendorId, $key, $value);
            return $this->successResponse($metadata, 'Metadata saved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to save metadata');
        }
    }

    /**
     * Get vendor metadata
     */
    public function getMetadata(int $vendorId, string $key, $default = null)
    {
        $metadata = $this->metadataRepo->findByVendorAndKey($vendorId, $key);
        return $metadata ? $metadata->meta_value : $default;
    }

    /**
     * Get all metadata for vendor as key-value array
     */
    public function getAllMetadata(int $vendorId): array
    {
        $metadata = $this->metadataRepo->listByVendor($vendorId);
        $result = [];
        
        foreach ($metadata as $meta) {
            $result[$meta->meta_key] = $meta->meta_value;
        }
        
        return $result;
    }

    /**
     * Delete vendor metadata
     */
    public function deleteMetadata(int $vendorId, string $key): \App\Core\ServiceResponse
    {
        try {
            $deleted = $this->metadataRepo->deleteByVendorAndKey($vendorId, $key);
            
            if (!$deleted) {
                return $this->errorResponse('Metadata not found', 404);
            }

            return $this->successResponse(null, 'Metadata deleted successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to delete metadata');
        }
    }

    // ==================== Rating Management ====================

    /**
     * Create vendor rating
     */
    public function createRating(int $vendorId, int $userId, array $data): \App\Core\ServiceResponse
    {
        try {
            // Check if user already rated this vendor for this order
            $existing = $this->ratingRepo->findByVendorUserOrder(
                $vendorId, 
                $userId, 
                $data['order_id'] ?? null
            );

            if ($existing) {
                return $this->errorResponse('You have already rated this vendor', 422);
            }

            $rating = $this->ratingRepo->create([
                'vendor_id' => $vendorId,
                'user_id' => $userId,
                'order_id' => $data['order_id'] ?? null,
                'rating' => $data['rating'],
                'review' => $data['review'] ?? null,
                'is_approved' => false,
            ]);

            return $this->successResponse($rating, 'Rating submitted successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to create rating');
        }
    }

    /**
     * Approve vendor rating (admin only)
     */
    public function approveRating(int $ratingId): \App\Core\ServiceResponse
    {
        try {
            $approved = $this->ratingRepo->approve($ratingId);
            
            if (!$approved) {
                return $this->errorResponse('Failed to approve rating', 500);
            }

            // Update vendor's average rating
            $rating = $this->ratingRepo->findById($ratingId);
            $this->updateVendorRatingStats($rating->vendor_id);

            return $this->successResponse(null, 'Rating approved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to approve rating');
        }
    }

    /**
     * List vendor ratings (approved only)
     */
    public function listRatings(int $vendorId, int $perPage = 15)
    {
        return $this->ratingRepo->listApprovedByVendor($vendorId, $perPage);
    }

    /**
     * List all vendor ratings (including unapproved - admin only)
     */
    public function listAllRatings(int $vendorId, int $perPage = 15)
    {
        return $this->ratingRepo->listByVendor($vendorId, $perPage);
    }

    /**
     * Update vendor rating statistics
     */
    protected function updateVendorRatingStats(int $vendorId): void
    {
        $avgRating = $this->ratingRepo->getAverageRating($vendorId);
        $ratingCount = $this->ratingRepo->getRatingCount($vendorId);

        $vendor = Vendor::findOrFail($vendorId);
        $vendor->rating_avg = $avgRating;
        $vendor->rating_count = $ratingCount;
        $vendor->save();
    }
}
