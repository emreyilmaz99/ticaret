<?php

namespace App\Interfaces\Services\Vendor;

interface VendorApplicationQueryServiceInterface
{
    public function index(array $filters = []);
    public function show(int $id);
    public function getVendorApplicationStatus($vendor);
    public function getPendingPreApplications();
}
