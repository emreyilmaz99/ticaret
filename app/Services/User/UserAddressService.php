<?php

namespace App\Services\User;

use App\Interfaces\Services\User\UserAddressServiceInterface;
use App\Core\ServiceResponse;
use App\Repositories\Interfaces\UserAddressRepositoryInterface;
use App\Services\BaseService;

class UserAddressService extends BaseService implements UserAddressServiceInterface
{
    public function __construct(
        private readonly UserAddressRepositoryInterface $addressRepo
    ) {}

    /**
     * Get all addresses for user
     */
    public function getUserAddresses(int $userId): ServiceResponse
    {
        try {
            $addresses = $this->addressRepo->getForUser($userId);

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
            $address = $this->addressRepo->findForUser($userId, $addressId);

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
            $addressCount = $this->addressRepo->countForUser($userId);
            
            if ($isDefault || $addressCount === 0) {
                $this->addressRepo->clearDefaultForUser($userId);
                $data['is_default'] = true;
            }

            $data['user_id'] = $userId;
            $address = $this->addressRepo->create($data);

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
            $address = $this->addressRepo->findForUser($userId, $addressId);

            if (!$address) {
                return $this->errorResponse('Adres bulunamadı', 404);
            }

            // If marking as default, reset other defaults
            if (isset($data['is_default']) && $data['is_default']) {
                $this->addressRepo->clearDefaultExcept($userId, $addressId);
            }

            $this->addressRepo->update($address, $data);

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
            $address = $this->addressRepo->findForUser($userId, $addressId);

            if (!$address) {
                return $this->errorResponse('Adres bulunamadı', 404);
            }

            // If deleting default address, set another as default
            if ($address->is_default) {
                $newDefault = $this->addressRepo->findFirstExcluding($userId, $addressId);
                
                if ($newDefault) {
                    $this->addressRepo->update($newDefault, ['is_default' => true]);
                }
            }

            $this->addressRepo->delete($address);

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
            $address = $this->addressRepo->findForUser($userId, $addressId);

            if (!$address) {
                return $this->errorResponse('Adres bulunamadı', 404);
            }

            // Reset all other defaults
            $this->addressRepo->clearDefaultExcept($userId, $addressId);
            $this->addressRepo->update($address, ['is_default' => true]);

            return $this->successResponse(['address' => $address->fresh()], 'Varsayılan adres ayarlandı');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Varsayılan adres ayarlanamadı');
        }
    }
}
