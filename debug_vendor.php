<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Services\VendorService;

$service = app(VendorService::class);
$result = $service->listForAdminResponse(15, 'pending_full_approval');

echo "Success: " . ($result->isSuccess() ? 'true' : 'false') . "\n";
echo "First vendor ID: ";
$data = $result->getData();
if (isset($data['data']) && count($data['data']) > 0) {
    $first = $data['data'][0];
    // Resolve resource if it's an Eloquent resource
    if ($first instanceof \Illuminate\Http\Resources\Json\JsonResource) {
        $resolved = $first->resolve();
        echo "ID = " . $resolved['id'] . "\n";
        echo "Company Name = " . ($resolved['company_name'] ?? 'N/A') . "\n";
        echo "Full Name = " . ($resolved['full_name'] ?? 'N/A') . "\n";
        echo "Email = " . ($resolved['email'] ?? 'N/A') . "\n";
    } else {
        print_r($first);
    }
} else {
    echo "No vendors found\n";
}
