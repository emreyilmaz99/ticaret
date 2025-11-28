<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitsController extends Controller
{
    public function index(Request $request)
    {
        $units = Unit::orderBy('id')->get();
        return response()->json(['success' => true, 'data' => $units], 200);
    }
}
