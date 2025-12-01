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
        $statusCode = 500;
        
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

