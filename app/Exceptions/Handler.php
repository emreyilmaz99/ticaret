<?php

namespace App\Exceptions;

use App\Core\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Exceptions\MissingAbilityException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Convert an authentication exception into a response.
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return ApiResponse::error('Unauthenticated.', 401);
        }

        return redirect()->guest(route('login'));
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Standardize API responses
        if ($request->is('api/*')) {
            return $this->renderApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    /**
     * Render API exceptions with consistent format.
     */
    protected function renderApiException($request, Throwable $e)
    {
        // Log all API exceptions for debugging
        \Log::error('API Exception', [
            'type' => get_class($e),
            'message' => $e->getMessage(),
            'url' => $request->url(),
            'method' => $request->method(),
        ]);

        // Authentication Exception (401)
        if ($e instanceof AuthenticationException) {
            return ApiResponse::error('Unauthenticated.', 401);
        }

        // Authorization Exception (403)
        if ($e instanceof AuthorizationException) {
            return ApiResponse::error($e->getMessage() ?: 'This action is unauthorized.', 403);
        }

        // Sanctum Missing Ability Exception (403)
        if ($e instanceof MissingAbilityException) {
            return ApiResponse::error('Forbidden - insufficient token abilities', 403);
        }

        // Model Not Found Exception (404)
        if ($e instanceof ModelNotFoundException) {
            return ApiResponse::error('Resource not found.', 404);
        }

        // Validation Exception (422)
        if ($e instanceof ValidationException) {
            return ApiResponse::error('Doğrulama hatası', 422, $e->errors());
        }

        // Method Not Allowed (405)
        if ($e instanceof MethodNotAllowedHttpException) {
            return ApiResponse::error('Method not allowed.', 405);
        }

        // Not Found Exception (404)
        if ($e instanceof NotFoundHttpException) {
            return ApiResponse::error('Endpoint not found.', 404);
        }

        // Too Many Requests (429)
        if ($e instanceof ThrottleRequestsException) {
            return ApiResponse::error('Too many requests.', 429);
        }

        // Generic HTTP Exception
        if ($e instanceof HttpException) {
            return ApiResponse::error($e->getMessage() ?: 'An error occurred.', $e->getStatusCode());
        }

        // Server Error (500) - only in production
        if (app()->environment('production')) {
            return ApiResponse::error('Internal server error.', 500);
        }

        // Development: Return full error details
        return parent::render($request, $e);
    }
}
