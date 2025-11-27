<?php

namespace App\Traits;

use function Symfony\Component\String\s;

trait ResponseHttp
{
    protected function success($data = null, string $message = 'OK', int $status = 200)
    {
        return response()->json([
            'status' => $status,
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function error(string $message = 'Error', int $status = 400, $errors = null)
    {
        return response()->json([
            'status' => $status,
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    protected function paginated($resourceCollection, $message = 'OK', int $status = 200)
    {
        return response()->json([
            'status' => $status,
            'success' => true,
            'message' => $message,
            'data' => $resourceCollection->items(),
            'meta' => [
                'current_page' => $resourceCollection->currentPage(),
                'last_page' => $resourceCollection->lastPage(),
                'per_page' => $resourceCollection->perPage(),
                'total' => $resourceCollection->total(),
            ],
        ], $status);
    }
}
