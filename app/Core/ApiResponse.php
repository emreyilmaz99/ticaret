<?php

namespace App\Core;

use Illuminate\Http\JsonResponse;

/**
 * Centralized API Response Handler
 * Single source of truth for all API responses
 */
class ApiResponse
{
    /**
     * Success response
     */
    public static function success($data = null, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Error response
     */
    public static function error(string $message = 'Error', int $status = 400, $errors = null): JsonResponse
    {
        $response = [
            'status' => $status,
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Paginated response
     */
    public static function paginated($resourceCollection, string $message = 'OK', int $status = 200): JsonResponse
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
        ], $status, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Convert ServiceResponse to JSON response
     */
    public static function fromServiceResponse($serviceResponse): JsonResponse
    {
        if (! is_object($serviceResponse) || ! method_exists($serviceResponse, 'getData')) {
            return self::error('Invalid service response', 500);
        }

        $data = $serviceResponse->getData();
        $status = method_exists($serviceResponse, 'getStatusCode') ? $serviceResponse->getStatusCode() : 200;
        $message = method_exists($serviceResponse, 'getMessage') ? $serviceResponse->getMessage() : ($status < 400 ? 'OK' : 'Error');
        $success = method_exists($serviceResponse, 'isSuccess') ? $serviceResponse->isSuccess() : ($status < 400);
        $errors = method_exists($serviceResponse, 'getErrors') ? $serviceResponse->getErrors() : null;

        // Paginated response
        if (is_array($data) && array_key_exists('data', $data) && array_key_exists('meta', $data)) {
            $response = [
                'status' => $status,
                'success' => $success,
                'message' => $message,
                'data' => $data['data'],
                'meta' => $data['meta'],
            ];
            
            if ($errors !== null) {
                $response['errors'] = $errors;
            }
            
            return response()->json($response, $status);
        }

        // Standard response
        $response = [
            'status' => $status,
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }
}
