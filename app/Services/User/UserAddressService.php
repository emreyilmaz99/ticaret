<?php

namespace App\Services\User;

use App\Interfaces\Services\User\UserAddressServiceInterface;
use App\Core\ServiceResponse;
use App\Models\UserAddress;
use App\Services\BaseService;

class UserAddressService extends BaseService implements UserAddressServiceInterface
{
    /**
     * Get all addresses for user
     */
    public function getUserAddresses(int $userId): ServiceResponse
    {
        try {
            $addresses = UserAddress::where('user_id', $userId)
                ->orderByDesc('is_default')
                ->orderByDesc('created_at')
                ->get();

            return $this->successResponse(['addresses' => $addresses], 'Adresler getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Adresler alınamadı');
        }
    }

    /**
     * Get single address
     */
    public function getAddress(int $userId, int $addressId): ServiceResponse
    {
        try {
            $address = UserAddress::where('user_id', $userId)
                ->where('id', $addressId)
                ->first();

            if (!$address) {
                return $this->errorResponse('Adres bulunamadı', 404);
            }

            return $this->successResponse(['address' => $address], 'Adres getirildi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Adres alınamadı');
        }
    }

    /**
     * Create new address
     */
    public function createAddress(int $userId, array $data): ServiceResponse
    {
        try {
            // If this is the first address or marked as default, reset other defaults
            $isDefault = $data['is_default'] ?? false;
            $addressCount = UserAddress::where('user_id', $userId)->count();
            
            if ($isDefault || $addressCount === 0) {
                UserAddress::where('user_id', $userId)->update(['is_default' => false]);
                $data['is_default'] = true;
            }

            $data['user_id'] = $userId;
            $address = UserAddress::create($data);

            return $this->successResponse(['address' => $address], 'Adres başarıyla eklendi', 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 'Adres eklenemedi');
        }
    }

    /**
     * Update address
     */
    public function updateAddress(int $userId, int $addressId, array $data): ServiceResponse
    {
        try {
            $address = UserAddress::where('user_id', $userId)
                ->where('id', $addressId)
                ->first();

            if (!$address) {
                return $this->errorResponse('Adres bulunamadı', 404);
            }

            // If marking as default, reset other defaults
            if (isset($data['is_default']) && $data['is_default']) {
                UserAddress::where('user_id', $userId)
                    ->where('id', '!=', $addressId)
                    ->update(['is_default' => false]);
            }

            $address->update($data);

            return $this->successResponse(['address' => $address->fresh()], 'Adres güncellendi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Adres güncellenemedi');
        }
    }

    /**
     * Delete address (soft delete)
     */
    public function deleteAddress(int $userId, int $addressId): ServiceResponse
    {
        try {
            $address = UserAddress::where('user_id', $userId)
                ->where('id', $addressId)
                ->first();

            if (!$address) {
                return $this->errorResponse('Adres bulunamadı', 404);
            }

            // If deleting default address, set another as default
            if ($address->is_default) {
                $newDefault = UserAddress::where('user_id', $userId)
                    ->where('id', '!=', $addressId)
                    ->first();
                
                if ($newDefault) {
                    $newDefault->update(['is_default' => true]);
                }
            }

            $address->delete();

            return $this->successResponse(null, 'Adres silindi');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Adres silinemedi');
        }
    }

    /**
     * Set address as default
     */
    public function setDefaultAddress(int $userId, int $addressId): ServiceResponse
    {
        try {
            $address = UserAddress::where('user_id', $userId)
                ->where('id', $addressId)
                ->first();

            if (!$address) {
                return $this->errorResponse('Adres bulunamadı', 404);
            }

            // Reset all other defaults
            UserAddress::where('user_id', $userId)
                ->where('id', '!=', $addressId)
                ->update(['is_default' => false]);

            $address->update(['is_default' => true]);

            return $this->successResponse(['address' => $address->fresh()], 'Varsayılan adres ayarlandı');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Varsayılan adres ayarlanamadı');
        }
    }
}
