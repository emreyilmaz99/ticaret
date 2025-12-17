<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Traits\ResponseHttp;
use Illuminate\Http\Request;

class UnitsController extends Controller
{
    use ResponseHttp;

    public function index(Request $request)
    {
        $units = Unit::orderBy('id')->get();
        return $this->success($units, 'Birimler başarıyla getirildi.');
    }
}
