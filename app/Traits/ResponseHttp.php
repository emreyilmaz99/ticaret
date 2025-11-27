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

    /**
     * Adapt a ServiceResponse-like object into the project's JSON response shape.
     *
     * This method is intentionally tolerant: it does not require a specific
     * concrete ServiceResponse class to exist in the codebase. Instead it
     * checks for the common methods used by such objects: `getData()`,
     * `getStatusCode()`, `getMessage()` and `isSuccess()`.
     *
     * Expected $serviceResponse->getData() to return either the payload or
     * an array containing both 'data' and 'meta' keys for paginated results.
     */
    protected function fromServiceResponse($serviceResponse)
    {
        if (! is_object($serviceResponse) || ! method_exists($serviceResponse, 'getData')) {
            return $this->error('Invalid service response', 500);
        }

        $data = $serviceResponse->getData();

        $status = method_exists($serviceResponse, 'getStatusCode') ? (int) $serviceResponse->getStatusCode() : 200;
        $message = method_exists($serviceResponse, 'getMessage') ? $serviceResponse->getMessage() : ($status < 400 ? 'OK' : 'Error');
        $success = method_exists($serviceResponse, 'isSuccess') ? (bool) $serviceResponse->isSuccess() : ($status < 400);

        // If the service returned ['data'=>..., 'meta'=>...] keep meta top-level
        if (is_array($data) && array_key_exists('data', $data) && array_key_exists('meta', $data)) {
            return response()->json([
                'status' => $status,
                'success' => $success,
                'message' => $message,
                'data' => $data['data'],
                'meta' => $data['meta'],
            ], $status);
        }

        return response()->json([
            'status' => $status,
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ], $status);
    }
}
