<?php

namespace App\Interfaces\Services\Vendor;

use App\Models\Vendor;

interface VendorApplicationQueryServiceInterface
{
    public function index(array $filters = []);
    public function show(int $id);
    public function getVendorApplicationStatus(Vendor $vendor);
    public function getPendingPreApplications();
}
