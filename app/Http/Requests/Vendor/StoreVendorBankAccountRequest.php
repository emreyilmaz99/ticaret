<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorBankAccountRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'bank_name' => 'nullable|string|max:191',
            'account_holder' => 'nullable|string|max:191',
            'iban' => 'nullable|string|max:64',
            'currency' => 'nullable|string|max:8',
            'is_primary' => 'sometimes|boolean',
        ];
    }
}
