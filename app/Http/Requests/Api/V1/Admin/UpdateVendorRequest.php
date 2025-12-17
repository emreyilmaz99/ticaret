<?php

namespace App\Http\Requests\Api\V1\Admin;


class UpdateVendorRequest extends BaseAdminRequest
{

    public function rules(): array
    {
        $vendorParam = $this->route('vendor');
        // route('vendor') may be an ID or a Vendor model (route model binding).
        $vendorId = is_object($vendorParam) && method_exists($vendorParam, 'getKey') ? $vendorParam->getKey() : $vendorParam;

        return [
            'name' => ['sometimes','string','max:255'],
            'email' => ['sometimes','email','max:255','unique:vendors,email,' . $vendorId],
            'password' => ['sometimes','string','min:6'],
        ];
    }
}
