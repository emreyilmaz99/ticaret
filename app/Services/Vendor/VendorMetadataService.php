<?php

namespace App\Services\Vendor;

use App\Interfaces\Services\Vendor\VendorMetadataServiceInterface;
use App\Services\BaseService;
use App\Core\ServiceResponse;
use App\Repositories\Interfaces\VendorMetadataRepositoryInterface;

class VendorMetadataService extends BaseService implements VendorMetadataServiceInterface
{
    protected VendorMetadataRepositoryInterface $metadataRepo;

    public function __construct(VendorMetadataRepositoryInterface $metadataRepo)
    {
        $this->metadataRepo = $metadataRepo;
    }

    /**
     * Metadata kaydet
     */
    public function set(int $vendorId, string $key, string $value): ServiceResponse
    {
        try {
            $metadata = $this->metadataRepo->upsert($vendorId, $key, $value);
            return $this->successResponse($metadata, 'Metadata saved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to save metadata');
        }
    }

    /**
     * Metadata getir
     */
    public function get(int $vendorId, string $key, $default = null)
    {
        $metadata = $this->metadataRepo->findByVendorAndKey($vendorId, $key);
        return $metadata ? $metadata->meta_value : $default;
    }

    /**
     * Tüm metadata'yı key-value array olarak getir
     */
    public function getAll(int $vendorId): array
    {
        $metadata = $this->metadataRepo->listByVendor($vendorId);
        $result = [];

        foreach ($metadata as $meta) {
            $result[$meta->meta_key] = $meta->meta_value;
        }

        return $result;
    }

    /**
     * Metadata sil
     */
    public function delete(int $vendorId, string $key): ServiceResponse
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

    /**
     * Birden fazla metadata'yı toplu kaydet
     */
    public function setMany(int $vendorId, array $metadata): ServiceResponse
    {
        try {
            foreach ($metadata as $key => $value) {
                $this->metadataRepo->upsert($vendorId, $key, $value);
            }

            return $this->successResponse(null, 'Metadata saved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e, 'Failed to save metadata');
        }
    }
}
