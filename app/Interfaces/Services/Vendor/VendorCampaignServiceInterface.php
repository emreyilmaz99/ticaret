<?php

namespace App\Interfaces\Services\Vendor;

use App\Core\ServiceResponse;

interface VendorCampaignServiceInterface
{
    public function getVendorCampaigns(int $vendorId): ServiceResponse;
    public function createCampaign(int $vendorId, array $data): ServiceResponse;
    public function getCampaign(int $vendorId, int $campaignId): ServiceResponse;
    public function updateCampaign(int $vendorId, int $campaignId, array $data): ServiceResponse;
    public function deleteCampaign(int $vendorId, int $campaignId): ServiceResponse;
    public function toggleCampaign(int $vendorId, int $campaignId): ServiceResponse;
}
