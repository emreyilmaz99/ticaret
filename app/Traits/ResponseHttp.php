<?php

namespace App\Traits;

use App\Core\ApiResponse;

trait ResponseHttp
{
    protected function success($data = null, string $message = 'OK', int $status = 200)
    {
        return ApiResponse::success($data, $message, $status);
    }

    protected function error(string $message = 'Error', int $status = 400, $errors = null)
    {
        return ApiResponse::error($message, $status, $errors);
    }

    protected function paginated($resourceCollection, $message = 'OK', int $status = 200)
    {
        return ApiResponse::paginated($resourceCollection, $message, $status);
    }

    protected function fromServiceResponse($serviceResponse)
    {
        return ApiResponse::fromServiceResponse($serviceResponse);
    }
}
