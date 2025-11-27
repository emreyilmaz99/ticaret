<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Http\Resources\VendorResource;

class VendorController extends Controller
{
    public function show($slug)
    {
        $vendor = Vendor::with(['addresses','bankAccounts'])->where('slug', $slug)->firstOrFail();
        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Vendor fetched',
            'data' => new VendorResource($vendor),
        ], 200);
    }
}
