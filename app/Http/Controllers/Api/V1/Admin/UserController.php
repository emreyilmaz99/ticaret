<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\BaseAdminController;
use App\Http\Resources\Api\V1\Admin\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends BaseAdminController
{
    protected UserService $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);

        $paginator = $this->service->list($perPage);

        $collection = UserResource::collection($paginator->getCollection());

        return $this->success([
            'data' => $collection,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
