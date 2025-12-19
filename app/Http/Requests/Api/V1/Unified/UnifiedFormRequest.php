<?php

namespace App\Http\Requests\Api\V1\Unified;

use App\Http\Middleware\DetectUserType;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Base class for Unified FormRequests
 * 
 * Provides user type detection for dynamic validation rules
 */
abstract class UnifiedFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware and controllers
    }

    /**
     * Get the authenticated user type
     */
    protected function getUserType(): string
    {
        return DetectUserType::getUserType($this);
    }

    /**
     * Get validation rules based on user type
     * 
     * Child classes should implement this method
     */
    abstract protected function rulesForUserType(string $userType): array;

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $userType = $this->getUserType();
        return $this->rulesForUserType($userType);
    }
}
