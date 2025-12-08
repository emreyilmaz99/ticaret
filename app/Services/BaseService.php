<?php

namespace App\Services;

use App\Core\ServiceResponse;
use Illuminate\Support\Facades\DB;

abstract class BaseService
{
    /**
     * Create a success ServiceResponse
     */
    protected function successResponse($data = null, string $message = 'OK', int $statusCode = 200): ServiceResponse
    {
        return (new ServiceResponse())
            ->setSuccess(true)
            ->setStatusCode($statusCode)
            ->setMessage($message)
            ->setData($data);
    }

    /**
     * Create an error ServiceResponse
     */
    protected function errorResponse(string $message = 'Error', int $statusCode = 400, $data = null): ServiceResponse
    {
        return (new ServiceResponse())
            ->setSuccess(false)
            ->setStatusCode($statusCode)
            ->setMessage($message)
            ->setData($data);
    }

    /**
     * Wrap exception in ServiceResponse
     */
    protected function handleException(\Exception $e, string $defaultMessage = 'An error occurred'): ServiceResponse
    {
        $message = $e->getMessage() ?: $defaultMessage;

        // Exception tipine göre status code belirle
        $statusCode = match(true) {
            $e instanceof \Illuminate\Validation\ValidationException => 422,
            $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException => 404,
            $e instanceof \App\Exceptions\InsufficientStockException => 422,
            $e instanceof \App\Exceptions\BusinessLogicException => $e->getCode() ?: 400,
            $e instanceof \Symfony\Component\HttpKernel\Exception\HttpException => $e->getStatusCode(),
            default => 500,
        };

        // Production'da 500 hatalarının detaylarını gizle
        if ($statusCode === 500 && !config('app.debug')) {
            $message = $defaultMessage;
        }

        // Hatayı logla
        if ($statusCode >= 500) {
            \Log::error('Service error', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return $this->errorResponse($message, $statusCode);
    }

    /**
     * Execute a database transaction and wrap result in ServiceResponse
     */
    protected function executeInTransaction(callable $callback): ServiceResponse
    {
        try {
            $result = DB::transaction($callback);
            return $this->successResponse($result);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}

